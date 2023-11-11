import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const customRequestRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ userId: z.string().min(1), chatId: z.string().min(1), additionalNotes: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(`input: ${JSON.stringify(input)}`)
      const user = await ctx.prisma.customerRequest.create({
        data: {
          userId: input.userId,
          chatId: input.chatId,
          additionalNotes: input.additionalNotes
        },
      });
      return user;
      
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.customerRequest.findMany({});
  }),
});
