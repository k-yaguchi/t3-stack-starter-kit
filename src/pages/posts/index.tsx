import { useMemo, useState, useCallback, type ReactElement } from "react";
import { useRouter } from "next/router";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_Row,
} from "mantine-react-table";
import { MRT_Localization_JA } from "mantine-react-table/locales/ja";
import { ActionIcon, Button, Flex, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconRefresh, IconTrash } from "@tabler/icons-react";
import { Post } from "@prisma/client";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import type { NextPageWithLayout } from "~/pages/_app";

type PostApiResponse = {
  data: Array<Post>;
  meta: {
    totalRowCount: number;
  };
};

const PostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const columns = useMemo<MRT_ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: "タイトル",
      },
      {
        accessorKey: "text",
        header: "テキスト",
      },
    ],
    []
  );

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isError, isFetching, isLoading, refetch } =
    api.posts.list.useQuery<PostApiResponse>({
      start: `${pagination.pageIndex * pagination.pageSize}`,
      size: `${pagination.pageSize}`,
      filters: JSON.stringify(columnFilters ?? []),
      sorting: JSON.stringify(sorting ?? []),
    });

  const postDeleteMutation = api.posts.delete.useMutation();

  const deleteRow = async (id: string) => {
    await postDeleteMutation.mutateAsync(id);
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Post>) => {
      if (!confirm(`「${row.original.title}」を削除してもよろしいですか？`)) {
        return;
      }
      void deleteRow(row.original.id);
    },
    [data]
  );

  const table = useMantineReactTable({
    columns: columns,
    data: data?.data ?? [],
    enableColumnFilterModes: false,
    enableEditing: true,
    enableGlobalFilter: false,
    initialState: { showColumnFilters: true, columnVisibility: { id: false } },
    localization: MRT_Localization_JA,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "データのロード中にエラーが発生しました",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    positionActionsColumn: "last",
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip withArrow position="left" label="編集">
          <ActionIcon
            onClick={() => {
              void router.push(`/posts/${row.original.id}`);
            }}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip withArrow position="right" label="削除">
          <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: () => (
      <Group>
        <Tooltip label="データを更新">
          <ActionIcon
            onClick={() => {
              void refetch();
            }}
          >
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
        <Button
          color="teal"
          onClick={() => {
            void router.push(`/posts/new`);
          }}
          variant="filled"
        >
          新規作成
        </Button>
      </Group>
    ),
    rowCount: data?.meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

PostPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PostPage;
