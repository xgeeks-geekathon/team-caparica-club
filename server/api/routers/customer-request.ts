import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CustomerRequestProgress } from "@prisma/client";

export const customRequestRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ userId: z.string().min(1), chatId: z.string().min(1), additionalNotes: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(`input: ${JSON.stringify(input)}`)
      const customerRequest = await ctx.prisma.customerRequest.create({
        data: {
          userId: input.userId,
          chatId: input.chatId,
          additionalNotes: input.additionalNotes,
          progress: CustomerRequestProgress.NotAssigned,
        },
      });
      return customerRequest;
      
    }),

  all: publicProcedure.query(async ({ ctx }) => {
    const requests = await ctx.prisma.customerRequest.findMany({});

    return requests
  }),
});
