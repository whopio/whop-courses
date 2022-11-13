import { handler } from "@/lib/api/handler";
import { getCompanyByRoute } from "@/lib/api/whop-oauth";
import invariant from "tiny-invariant";

export default handler(async (req, res) => {
  const { route } = req.query;
  invariant(typeof route === "string", "route must be a string");

  const company = await getCompanyByRoute(route);

  res.redirect(
    `https://whop.com/oauth?client_id=${process.env.WHOP_CLIENT_ID}&redirect_uri=${process.env.WHOP_REDIRECT_URI}&scope=${company.tag}`
  );
});
