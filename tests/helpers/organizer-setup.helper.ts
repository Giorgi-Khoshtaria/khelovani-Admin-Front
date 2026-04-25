import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { chromium } from "@playwright/test";

// ── Constants ─────────────────────────────────────────────────────────────────
export const ORGANIZER_EMAIL    = "test.organizer@khelovani.ge";
const ORGANIZER_PASSWORD        = "Partner-123!";

const ROOT                 = process.cwd();
const AUTH_DIR             = path.resolve(ROOT, "tests/.auth");
const ORG_JSON             = path.join(AUTH_DIR, "organizer.json");
const ORG_CREDENTIALS_FILE = path.join(AUTH_DIR, "organizer-credentials.json");

const rel = (p: string) => path.relative(ROOT, p);

// ── Internal helpers ──────────────────────────────────────────────────────────

function ensureAuthDir() {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
}

function getStoredToken(): string | null {
  try {
    const state = JSON.parse(fs.readFileSync(ORG_JSON, "utf-8"));
    return (
      state.origins
        ?.flatMap((o: { localStorage?: { name: string; value: string }[] }) => o.localStorage ?? [])
        .find((i: { name: string }) => i.name === "adminToken")?.value ?? null
    );
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string): Date | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
}

export function isOrganizerSessionValid(): boolean {
  if (!fs.existsSync(ORG_JSON)) return false;
  const token = getStoredToken();
  if (!token) return false;
  const expiry = getTokenExpiry(token);
  if (!expiry) return false;
  return expiry.getTime() > Date.now() + 5 * 60 * 1000;
}

async function isStoredTokenAcceptedByBackend(backendUrl: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    await axios.get(`${backendUrl}/api/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch {
    return false;
  }
}

export function readOrganizerCredentials(): { email: string; password: string } | null {
  try {
    if (!fs.existsSync(ORG_CREDENTIALS_FILE)) return null;
    const creds = JSON.parse(fs.readFileSync(ORG_CREDENTIALS_FILE, "utf-8"));
    if (creds.email && creds.password) return creds;
    return null;
  } catch {
    return null;
  }
}

function saveOrganizerCredentials(email: string, password: string) {
  ensureAuthDir();
  fs.writeFileSync(
    ORG_CREDENTIALS_FILE,
    JSON.stringify({ email, password }, null, 2),
    "utf-8",
  );
  console.log("Organizer credentials saved to", rel(ORG_CREDENTIALS_FILE));
}

function invalidateStoredSession() {
  if (fs.existsSync(ORG_JSON)) {
    fs.unlinkSync(ORG_JSON);
    console.log("Removed stale organizer.json.");
  }
}

/** Directly sets the partner's password in MongoDB by email. */
async function setPasswordInDb(email: string, plainPassword: string): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in .env.local — cannot set password directly in DB.");
  }

  const hashed = await bcrypt.hash(plainPassword, 12);
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("organisations").updateOne(
      { email },
      { $set: { password: hashed } },
    );
    if (result.matchedCount === 0) {
      throw new Error(`No partner found in DB with email: ${email}`);
    }
    console.log(`Password updated in DB for ${email}.`);
  } finally {
    await client.close();
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Ensures a valid organizer session exists in tests/.auth/organizer.json.
 *
 * Flow:
 *  1. If stored JWT is valid locally AND accepted by the backend → fast path.
 *  2. Read credentials from organizer-credentials.json, try login.
 *  3. If no credentials or login fails:
 *     a. Register partner if not found in DB.
 *     b. Approve partner via admin API.
 *     c. Set password directly in MongoDB to ORGANIZER_PASSWORD.
 *     d. Save credentials to organizer-credentials.json.
 *     e. Login.
 *  4. Write Playwright storageState to organizer.json.
 *  5. Probe /profile/products — throw if redirected to /login.
 */
export async function ensureOrganizerSession(
  backendUrl: string,
  baseURL: string,
  adminToken: string,
): Promise<void> {
  ensureAuthDir();

  // ── Fast path ─────────────────────────────────────────────────────────────
  if (isOrganizerSessionValid()) {
    const backendOk = await isStoredTokenAcceptedByBackend(backendUrl);
    if (backendOk) {
      console.log("Organizer session is valid — skipping re-auth.");
      return;
    }
    console.log("Organizer JWT rejected by backend — invalidating stored session.");
    invalidateStoredSession();
  }

  const stored = readOrganizerCredentials();
  let orgEmail    = stored?.email    ?? ORGANIZER_EMAIL;
  let orgPassword = stored?.password ?? "";

  // ── Try login with stored credentials ────────────────────────────────────
  let loginResponse = orgPassword
    ? await axios
        .post(`${backendUrl}/api/admin/auth/login`, { email: orgEmail, password: orgPassword })
        .catch(() => null)
    : null;

  if (loginResponse) {
    console.log("Organizer login succeeded with stored credentials.");
  }

  // ── No valid session — find / register / approve / set password ───────────
  if (!loginResponse) {
    console.log("Setting up organizer account…");
    orgEmail = ORGANIZER_EMAIL;

    // Find existing partner
    const searchRes = await axios.get(
      `${backendUrl}/api/admin/partners?search=${encodeURIComponent(orgEmail)}`,
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    let partner = (
      searchRes.data?.data?.partners ??
      searchRes.data?.partners ??
      searchRes.data?.data ??
      []
    ).find((p: { email: string }) => p.email === orgEmail);

    // Register if not found
    if (!partner) {
      console.log("Organizer not found — registering…");
      await axios.post(`${backendUrl}/api/partner/register`, {
        companyNameGe: "ტესტ ორგანიზაცია",
        companyNameEn: "Test Organization",
        identificationCode: Math.floor(100000000 + Math.random() * 900000000).toString(),
        contactPerson: "Test Organizer",
        phone: "599111222",
        city: "tbilisi",
        category: "other",
        email: orgEmail,
        address: "ტესტის ქუჩა 1",
        addressEn: "Test Street 1",
        terms: true,
      });
      console.log("Organizer registered.");

      const afterRegRes = await axios.get(
        `${backendUrl}/api/admin/partners?search=${encodeURIComponent(orgEmail)}`,
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
      partner = (
        afterRegRes.data?.data?.partners ??
        afterRegRes.data?.partners ??
        afterRegRes.data?.data ??
        []
      ).find((p: { email: string }) => p.email === orgEmail);
    }

    if (!partner) {
      throw new Error(`Could not find or create organizer partner for email: ${orgEmail}`);
    }

    const partnerId = partner._id ?? partner.id;
    if (!partnerId) {
      throw new Error(`Partner has no id. Object: ${JSON.stringify(partner)}`);
    }

    // Approve partner
    console.log("Approving organizer partner (id:", partnerId, ")…");
    await axios.patch(
      `${backendUrl}/api/admin/partners/${partnerId}/status`,
      { status: "APPROVED" },
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    // Set known password directly in MongoDB
    orgPassword = ORGANIZER_PASSWORD;
    await setPasswordInDb(orgEmail, orgPassword);
    saveOrganizerCredentials(orgEmail, orgPassword);

    // Login with known password
    loginResponse = await axios
      .post(`${backendUrl}/api/admin/auth/login`, { email: orgEmail, password: orgPassword })
      .catch((err) => {
        throw new Error(
          `Organizer login failed after setup: ${err?.response?.data?.message ?? err.message}`,
        );
      });
  }

  if (!loginResponse?.data) throw new Error("Organizer login response is empty.");

  // ── Extract token + partnerId ─────────────────────────────────────────────
  const orgToken =
    loginResponse.data.token ??
    loginResponse.data.accessToken ??
    loginResponse.data.data?.token;

  const orgPartnerId =
    loginResponse.data.id ??
    loginResponse.data._id ??
    loginResponse.data.partnerId ??
    loginResponse.data.user?._id ??
    loginResponse.data.data?.user?._id ??
    loginResponse.data.data?._id;

  if (!orgToken) {
    throw new Error(`Organizer token not found in login response: ${JSON.stringify(loginResponse.data)}`);
  }

  // ── Write Playwright storageState ─────────────────────────────────────────
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext();
    const pg = await ctx.newPage();
    await pg.goto(baseURL);
    await pg.evaluate(
      ({ token, partnerId }) => {
        localStorage.setItem("adminToken", token);
        if (partnerId) localStorage.setItem("partnerId", partnerId);
      },
      { token: orgToken, partnerId: orgPartnerId },
    );
    await ctx.storageState({ path: ORG_JSON });
    console.log("✓ Organizer session saved to", rel(ORG_JSON));

    // ── Navigation probe ──────────────────────────────────────────────────
    console.log("Probing /profile/products…");
    const probeCtx = await browser.newContext({ storageState: ORG_JSON });
    const probePg = await probeCtx.newPage();
    await probePg.goto(`${baseURL}/profile/products`, { waitUntil: "networkidle" });
    const finalUrl = probePg.url();
    if (finalUrl.includes("/login")) {
      throw new Error(
        `Session probe failed — redirected to login.\nFinal URL: ${finalUrl}`,
      );
    }
    console.log("✓ Organizer session probe passed — landed on:", finalUrl);
    await probeCtx.close();
  } finally {
    await browser.close();
  }
}
