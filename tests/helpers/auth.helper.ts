import * as fs from "fs";
import * as path from "path";
import { ORGANIZER_EMAIL } from "./organizer-setup.helper";

const AUTH_DIR = path.resolve(process.cwd(), "tests/.auth");

/** Returns the persisted organizer password from the .auth folder. */
export function loadOrganizerPassword(): string {
  const credsFile = path.join(AUTH_DIR, "organizer-credentials.json");
  if (fs.existsSync(credsFile)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credsFile, "utf-8"));
      if (creds.password) return creds.password;
    } catch { /* fall through */ }
  }
  return process.env.ORGANIZER_PASSWORD ?? "";
}

/** Export the organizer email constant so test files can reference it. */
export { ORGANIZER_EMAIL };

/** Resolves the organizer partnerId from the saved storage state. */
export function resolveTestPartnerId(): string {
  const stateFile = path.join(AUTH_DIR, "organizer.json");
  if (fs.existsSync(stateFile)) {
    try {
      const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
      const partnerId = state.origins
        ?.flatMap(
          (o: { localStorage?: { name: string; value: string }[] }) =>
            o.localStorage ?? [],
        )
        .find((i: { name: string }) => i.name === "partnerId")?.value;
      if (partnerId) return partnerId;
    } catch {
      /* fall through */
    }
  }
  return process.env.ORGANIZER_PARTNER_ID ?? "";
}
