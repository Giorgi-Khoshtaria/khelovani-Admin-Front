/**
 * One-shot script to rebuild the organizer test session from scratch.
 *
 * Usage:
 *   npm run test:e2e:reset-organizer
 *
 * Deletes stale organizer.json, then calls
 * ensureOrganizerSession so the full register → approve → login flow runs.
 * Prints the resulting token's expiry so you can confirm it's fresh.
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { ensureOrganizerSession } from "../helpers/organizer-setup.helper";
import axios from "axios";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const AUTH_DIR = path.resolve(process.cwd(), "tests/.auth");
const ORG_JSON = path.join(AUTH_DIR, "organizer.json");

async function main() {
  const backendUrl = process.env.VITE_BACKEND_API_URL;
  const baseURL    = process.env.VITE_BASE_URL ?? "http://localhost:5173";
  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!backendUrl) throw new Error("VITE_BACKEND_API_URL is not set in .env.local");
  if (!adminEmail || !adminPassword) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env.local");

  // Only delete the stale session — keep the password file so login can reuse it
  if (fs.existsSync(ORG_JSON)) {
    fs.unlinkSync(ORG_JSON);
    console.log("Deleted stale organizer.json.");
  }

  // Obtain a fresh admin token
  console.log("Logging in as admin…");
  const adminRes = await axios.post(`${backendUrl}/api/admin/auth/login`, {
    email: adminEmail,
    password: adminPassword,
  });
  const adminToken =
    adminRes.data.token ??
    adminRes.data.accessToken ??
    adminRes.data.data?.token;

  if (!adminToken) throw new Error(`Admin token missing: ${JSON.stringify(adminRes.data)}`);
  console.log("Admin login OK.");

  // Rebuild organizer session
  await ensureOrganizerSession(backendUrl, baseURL, adminToken);

  // Print expiry of the fresh token
  const state = JSON.parse(fs.readFileSync(ORG_JSON, "utf-8"));
  const token = state.origins
    ?.flatMap((o: { localStorage?: { name: string; value: string }[] }) => o.localStorage ?? [])
    .find((i: { name: string }) => i.name === "adminToken")?.value;

  if (token) {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const exp = payload.exp ? new Date(payload.exp * 1000) : null;
    console.log("Token expires at:", exp?.toISOString() ?? "unknown");
  }

  console.log("Done. Run your organizer tests now.");
}

main().catch((err) => {
  console.error("reset-organizer failed:", err.message ?? err);
  process.exit(1);
});
