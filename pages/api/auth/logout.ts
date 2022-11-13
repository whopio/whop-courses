import { clearCookie } from "@/lib/api/cookie";
import { handler } from "@/lib/api/handler";

export default handler(async (req, res) => {
  res.setHeader("set-cookie", clearCookie("c_token"));
  res.redirect("/");
});
