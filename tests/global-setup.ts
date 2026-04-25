import { chromium, FullConfig } from "@playwright/test";
import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import {
  ensureOrganizerSession,
} from "./helpers/organizer-setup.helper";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const backendUrl = process.env.VITE_BACKEND_API_URL!;

  // Ensure .auth directory exists
  const authDir = path.resolve(process.cwd(), "tests/.auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  console.log("Global setup starting with baseURL:", baseURL);
  console.log("Backend URL:", backendUrl);

  // ── 1. Setup Admin ────────────────────────────────────────────────────────
  let adminToken: string | null = null;

  try {
    console.log("Logging in as Admin:", process.env.ADMIN_EMAIL);
    const adminResponse = await axios.post(
      `${backendUrl}/api/admin/auth/login`,
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    );

    adminToken =
      adminResponse.data.token ??
      adminResponse.data.accessToken ??
      adminResponse.data.data?.token;

    const adminPartnerId =
      adminResponse.data.id ??
      adminResponse.data._id ??
      adminResponse.data.partnerId ??
      adminResponse.data.user?._id;

    if (!adminToken) {
      throw new Error(
        `Admin token not found in response: ${JSON.stringify(adminResponse.data)}`,
      );
    }

    const browser = await chromium.launch();
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto(baseURL!);
    await adminPage.evaluate(
      ({ token, partnerId }) => {
        localStorage.setItem("adminToken", token);
        if (partnerId) localStorage.setItem("partnerId", partnerId);
      },
      { token: adminToken, partnerId: adminPartnerId },
    );
    await adminPage
      .context()
      .storageState({ path: path.join(authDir, "admin.json") });
    await browser.close();
    console.log("✓ Admin storage state saved.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to setup Admin auth:",
        error.response?.data || error.message,
      );
    } else {
      console.error(
        "Failed to setup Admin auth:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  // ── 2. Setup Organizer (self-contained — no env vars needed) ─────────────
  if (!adminToken) {
    const { isOrganizerSessionValid } = await import("./helpers/organizer-setup.helper");
    if (isOrganizerSessionValid()) {
      console.log("Admin login failed but organizer session is still valid — skipping organizer re-auth.");
    } else {
      throw new Error("Admin login failed and no valid organizer session exists. Aborting test run.");
    }
  } else {
    await ensureOrganizerSession(backendUrl, baseURL!, adminToken);
  }
}

export default globalSetup;
