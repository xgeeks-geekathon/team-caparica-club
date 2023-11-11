import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

export const lambda = createTRPCRouter({

  get: publicProcedure
    .input(z.object({ chat: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(`input: ${JSON.stringify(input)}`)

      const response = await fetch(env.LAMBDA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: 'How are ya today?'}),
      });
    
      return response.json();
    }),
});
