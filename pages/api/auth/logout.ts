import { API } from "@/lib/api/api";
import { clearCookie } from "@/lib/api/cookie";

export default API.noContext().get((req, res) => {
  if (req.headers["next-router-prefetch"] === "1") return null;
  res.setHeader("set-cookie", clearCookie("c_token"));
  res.redirect("/");
});
