import {
  defineEventHandler,
  H3Event,
  getRequestURL,
  getSession,
  sendRedirect,
} from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const noAuthRoutes = ["/login", "/"];
  const cookieHash = process.env["HASH_COOKIE"]!;
  const pathName = getRequestURL(event).pathname;

  /**
   * Checks for session (h3 cryptographed cookie)
   */
  const { data } = await getSession<{
    user: any;
    access_token: string;
    refresh_token: string;
  }>(event, {
    password: cookieHash,
  });

  console.log({ pathName, data: JSON.stringify(data) });
  /**
   * No auth for landing page
   * tRPC has its own auth via session
   */
  if (
    noAuthRoutes.includes(pathName) ||
    pathName.startsWith("/trpc") ||
    pathName.startsWith("/api/trpc")
  ) {
    return;
  }

  if (!data.access_token) {
    return sendRedirect(event, "/login", 401);
  }
});
