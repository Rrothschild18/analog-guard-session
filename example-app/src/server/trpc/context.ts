import { getSession, H3Event } from "h3";
import { inferAsyncReturnType } from "@trpc/server";
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (event: H3Event) => {
  const cookieHash = process.env["HASH_COOKIE"]!;

  const {
    data: { user = null, access_token = null, refresh_token = null },
  } = await getSession<{
    user: any;
    access_token: string;
    refresh_token: string;
  }>(event, {
    password: cookieHash,
  });

  return {
    user,
    access_token,
    refresh_token,
    event,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
