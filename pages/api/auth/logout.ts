import { BaseAPI } from "@/lib/api/api";
import { clearCookie } from "@/lib/api/cookie";

export default BaseAPI.get((req, res) => {
  if (req.headers["next-router-prefetch"] === "1") return null;
  res.setHeader("set-cookie", clearCookie("c_token"));
  res.redirect("/");
});
