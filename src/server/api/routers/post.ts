import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { postSchema as postCreateSchema } from "~/pages/posts/new";
import { postSchema as postUpdateSchema } from "~/pages/posts/[id]";
import { z } from "zod";
import { MRT_ColumnFiltersState, MRT_SortingState } from "mantine-react-table";

const paramSchema = z.object({
  start: z.string(),
  size: z.string(),
  filters: z.string(),
  sorting: z.string(),
});
export const postRouter = createTRPCRouter({
  list: protectedProcedure.input(paramSchema).query(async ({ input, ctx }) => {
    const { start, size, filters, sorting } = input as Record<string, string>;

    const parsedColumnFilters = JSON.parse(
      filters ?? "{}"
    ) as MRT_ColumnFiltersState;

    const whereClause = parsedColumnFilters.reduce(
      (acc: Record<string, unknown>, cur) => {
        acc[cur.id] = { contains: cur.value };
        return acc;
      },
      {}
    );

    const parsedSorting = JSON.parse(sorting ?? "{}") as MRT_SortingState;

    const orderByClause = parsedSorting.reduce(
      (acc: Record<string, string>, cur) => {
        acc[cur.id] = cur.desc ? "desc" : "asc";
        return acc;
      },
      {}
    );

    const posts = await ctx.prisma.post.findMany({
      where: whereClause,
      skip: parseInt(start ?? "0"),
      take: parseInt(size ?? "10"),
      orderBy: orderByClause,
    });
    return {
      data: posts,
      meta: {
        totalRowCount: posts.length,
      },
    };
  }),
  byId: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
    });
  }),
  create: protectedProcedure
    .input(postCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          title: input.title,
          text: input.text,
        },
      });
    }),
  update: protectedProcedure
    .input(postUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          text: input.text,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
});
