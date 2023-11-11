import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { customerRequest } from "@/server/db/schema";

export const customRequestRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ userId: z.string().min(1), chatId: z.string().min(1), additionalNotes: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(customerRequest).values({
        userId: input.userId,
        chatId: input.chatId,
        additionalNotes: input.additionalNotes,
      });
    }),

  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.customerRequest.findMany({
      orderBy: (customerRequest, { desc }) => [desc(customerRequest.createdAt)],
    });
  }),
});
