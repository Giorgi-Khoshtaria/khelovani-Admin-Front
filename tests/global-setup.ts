import { chromium, FullConfig } from "@playwright/test";
import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const backendUrl = process.env.VITE_BACKEND_API_URL;

  // Ensure .auth directory exists
  const authDir = path.resolve(process.cwd(), "tests/.auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  const browser = await chromium.launch();

  console.log("Global setup starting with baseURL:", baseURL);
  console.log("Backend URL:", backendUrl);

  // 1. Setup Admin
  try {
    console.log("Logging in as Admin:", process.env.ADMIN_EMAIL);
    const adminResponse = await axios.post(
      `${backendUrl}/api/admin/auth/login`,
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    );

    const adminToken =
      adminResponse.data.token ||
      adminResponse.data.accessToken ||
      adminResponse.data.data?.token;
    const adminPartnerId =
      adminResponse.data.id ||
      adminResponse.data._id ||
      adminResponse.data.partnerId ||
      adminResponse.data.user?._id;

    if (!adminToken) {
      throw new Error(
        `Admin token not found in response: ${JSON.stringify(adminResponse.data)}`,
      );
    }

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
    console.log("Admin storage state saved.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to setup Admin auth:",
        error.response?.data || error.message || error,
      );
    } else {
      console.error(
        "Failed to setup Admin auth:",
        error instanceof Error ? error.message : "Unknown error",
        error,
      );
    }
  }

  // 2. Setup Organizer
  try {
    const orgEmail = process.env.ORGANIZER_EMAIL!;
    const orgPassword = process.env.ORGANIZER_PASSWORD!;

    console.log("Logging in as Organizer:", orgEmail);
    let orgResponse = await axios
      .post(`${backendUrl}/api/admin/auth/login`, {
        email: orgEmail,
        password: orgPassword,
      })
      .catch(() => null);

    // If login fails, try to create/fix the organizer account using Admin token
    if (!orgResponse) {
      console.log(
        "Organizer login failed, checking if account needs creation/activation...",
      );

      // Get Admin token (previously saved)
      const adminAuthFile = path.join(authDir, "admin.json");
      if (fs.existsSync(adminAuthFile)) {
        const adminState = JSON.parse(fs.readFileSync(adminAuthFile, "utf-8"));
        const adminToken = adminState.origins[0].localStorage.find(
          (i: any) => i.name === "adminToken",
        )?.value;

        if (adminToken) {
          // 1. Search for existing partner
          const searchResponse = await axios.get(
            `${backendUrl}/api/admin/partners?search=${orgEmail}`,
            {
              headers: { Authorization: `Bearer ${adminToken}` },
            },
          );

          let partner = searchResponse.data.partners?.find(
            (p: any) => p.email === orgEmail,
          );

          if (!partner) {
            console.log("Registering missing organizer...");
            try {
              const regResponse = await axios.post(
                `${backendUrl}/api/partner/register`,
                {
                  companyNameGe: "ტესტ ორგანიზაცია",
                  companyNameEn: "Test Organization",
                  identificationCode: Math.floor(
                    100000000 + Math.random() * 900000000,
                  ).toString(),
                  contactPerson: "Test Organizer",
                  phone: "599111222",
                  city: "tbilisi",
                  category: "art",
                  email: orgEmail,
                  address: "ტესტის ქუჩა 1",
                  addressEn: "Test Street 1",
                  terms: true,
                },
              );
              partner = regResponse.data.partner;
            } catch (regError: any) {
              if (regError.response?.status === 409) {
                console.log(
                  "Organizer email/code already exists, proceeding to activation...",
                );
                // Re-fetch to get the ID
                const retrySearch = await axios.get(
                  `${backendUrl}/api/admin/partners?search=${orgEmail}`,
                  {
                    headers: { Authorization: `Bearer ${adminToken}` },
                  },
                );
                partner = retrySearch.data.partners?.find(
                  (p: any) => p.email === orgEmail,
                );
              } else {
                throw regError;
              }
            }
          }

          if (partner && (partner._id || partner.id)) {
            const partnerId = partner._id || partner.id;
            console.log(
              "Activating organizer and capturing dynamic password (ID:",
              partnerId,
              ")...",
            );

            // Activate and capture generated password
            const approveResponse = await axios.patch(
              `${backendUrl}/api/admin/partners/${partnerId}/status`,
              { status: "APPROVED" },
              { headers: { Authorization: `Bearer ${adminToken}` } },
            );

            const capturedPassword = approveResponse.data.plainPassword;
            if (capturedPassword) {
              console.log("Captured dynamic password for organizer login.");
              process.env.ORGANIZER_PASSWORD = capturedPassword;
            }

            // Retry login now that status is APPROVED and we have the password
            orgResponse = await axios.post(
              `${backendUrl}/api/admin/auth/login`,
              {
                email: orgEmail,
                password: process.env.ORGANIZER_PASSWORD,
              },
            );
          }
        }
      }
    }

    if (orgResponse && orgResponse.data) {
      const orgToken =
        orgResponse.data.token ||
        orgResponse.data.accessToken ||
        orgResponse.data.data?.token;
      const orgPartnerId =
        orgResponse.data.id ||
        orgResponse.data._id ||
        orgResponse.data.partnerId ||
        orgResponse.data.user?._id;

      if (orgToken) {
        const orgContext = await browser.newContext();
        const orgPage = await orgContext.newPage();
        await orgPage.goto(baseURL!);
        await orgPage.evaluate(
          ({ token, partnerId }) => {
            localStorage.setItem("adminToken", token);
            if (partnerId) localStorage.setItem("partnerId", partnerId);
          },
          { token: orgToken, partnerId: orgPartnerId },
        );
        await orgPage
          .context()
          .storageState({ path: path.join(authDir, "organizer.json") });
        console.log("Organizer storage state saved.");
      } else {
        console.warn(
          "Organizer token not found in response, skipping organizer setup.",
        );
      }
    } else {
      console.warn("Skipping Organizer setup due to failure to login/create.");
    }
  } catch (error: unknown) {
    console.warn(
      "Failed to setup Organizer auth (non-fatal):",
      error instanceof Error ? error.message : error,
    );
  }

  await browser.close();
}

export default globalSetup;
