import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { postSchema } from "~/pages/posts/new";

export const postRouter = createTRPCRouter({
  create: publicProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.post.create({
      data: {
        title: input.title,
        text: input.text,
      },
    });
  }),
});
