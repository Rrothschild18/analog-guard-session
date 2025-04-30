import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { getSession, useSession } from "h3";

const AuthResponse = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: z.object({
      name: z.string(),
      age: z.number(),
    }),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponse>;

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    const cookieHash = process.env["HASH_COOKIE"]!;

    const { data } = await getSession<{
      user: any;
      access_token: string;
      refresh_token: string;
    }>(ctx.event, {
      password: cookieHash,
    });

    return data;
  }),

  signIn: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await new Promise<AuthResponse>((res, rej) => {
        res({
          data: {
            access_token: "123",
            refresh_token: "analog",
            user: { name: "Raul", age: 27 },
          },
        });
      });
      const cookieHash = process.env["HASH_COOKIE"]!;

      const sessionHandler = await useSession(ctx.event, {
        password: cookieHash,
        cookie: {
          httpOnly: true,
          // secure: true,
          sameSite: "strict",
        },
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      await sessionHandler.update({
        user: data.user,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      return data;
    }),
});
