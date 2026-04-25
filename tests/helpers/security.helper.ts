import * as fs from "fs";
import * as path from "path";
import axios, { type AxiosRequestConfig } from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const backendUrl = process.env.VITE_BACKEND_API_URL!;

function extractToken(storageStatePath: string): string | null {
  try {
    const raw = fs.readFileSync(storageStatePath, "utf-8");
    const state = JSON.parse(raw);
    return (
      state.origins
        ?.flatMap((o: { localStorage?: { name: string; value: string }[] }) => o.localStorage ?? [])
        .find((i: { name: string }) => i.name === "adminToken")
        ?.value ?? null
    );
  } catch {
    return null;
  }
}

export const roleTokens = {
  admin: () =>
    extractToken(path.resolve(process.cwd(), "tests/.auth/admin.json")),
  organizer: () =>
    extractToken(path.resolve(process.cwd(), "tests/.auth/organizer.json")),
};

type Role = "admin" | "organizer";

export interface ApiCallOptions {
  method: string;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
}

/** Makes a direct HTTP request as the given role (or no auth when role is null). */
export async function callApiAs(role: Role | null, opts: ApiCallOptions) {
  const token = role ? roleTokens[role]() : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const cfg: AxiosRequestConfig = {
    method: opts.method,
    url: `${backendUrl}${opts.url}`,
    headers,
    data: opts.data,
    validateStatus: () => true,
  };
  return axios(cfg);
}

/** Asserts the response status is 401. */
export function expectUnauthorized(status: number) {
  if (status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${status}`);
  }
}

/** Asserts the response is 401, 403, or 404 (unauthorized/forbidden/hidden). */
export function expectForbidden(status: number) {
  if (status !== 401 && status !== 403 && status !== 404) {
    throw new Error(`Expected 401/403/404 (unauthorized/forbidden/hidden) but got ${status}`);
  }
}

export const XSS_PAYLOADS = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "javascript:alert(1)",
  `"><img src=x onerror=alert(1)>`,
] as const;

export const NOSQL_PAYLOADS = [
  '{"$gt": ""}',
  '{"$ne": null}',
  '{"$where": "sleep(1000)"}',
  '{"$regex": ".*"}',
] as const;

export const TRAVERSAL_PAYLOADS = [
  "../../etc/passwd",
  "../../../etc/shadow",
  "%2e%2e%2f%2e%2e%2f",
] as const;
