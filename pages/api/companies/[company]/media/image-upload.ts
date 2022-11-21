import { API, APIType } from "@/lib/api/api";
import { companyAdminUserContext } from "@/lib/api/context-functions";
import FormData from "form-data";

const handler = API.withContext(companyAdminUserContext).get(async () => {
  const requestData = new FormData();
  requestData.append("requireSignedURLs", "false");
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        ...requestData.getHeaders(),
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
      },
      body: requestData.getBuffer(),
    }
  );
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }
  const data = await response.json();

  return { url: data.result.uploadURL, id: data.result.id };
});

export default handler;

export type APIImageUpload = APIType<typeof handler>;
