import { useRouter } from "next/router";
import { useEffect, type ReactElement } from "react";
import NextError from "next/error";
import {
  Container,
  Paper,
  Button,
  Group,
  TextInput,
  Textarea,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import type { NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSideProps } from "next";

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "必須です" }),
  text: z.string().min(1, { message: "必須です" }),
});

export type Post = z.infer<typeof postSchema>;

const PostUpdatePage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { isSuccess, isError, isLoading, data, error } =
    api.posts.byId.useQuery(id, {
      cacheTime: 0,
      enabled: !!id,
    });

  const postUpdateMutation = api.posts.update.useMutation();

  const form = useForm({
    validate: zodResolver(postSchema),
    initialValues: {
      id: "",
      title: "",
      text: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        form.setValues({
          id: data.id,
          title: data.title,
          text: data.text,
        });
      }
    }
  }, [isSuccess]);

  if (isError) {
    return (
      <NextError
        title={error.message}
        statusCode={error.data?.httpStatus ?? 500}
      />
    );
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  const handleSubmit = async (values: Post) => {
    await postUpdateMutation.mutateAsync(values);
    void router.push(`/posts`);
  };

  return (
    <Container>
      <Paper p="md" m="md" shadow="md">
        <form
          onSubmit={form.onSubmit((values) => {
            void handleSubmit(values);
          })}
        >
          <TextInput
            withAsterisk
            label="タイトル"
            placeholder="タイトルを入力してください"
            {...form.getInputProps("title")}
          />
          <Textarea
            withAsterisk
            label="テキスト"
            placeholder="テキストを入力してください"
            {...form.getInputProps("text")}
            mt="xs"
          />

          <Group position="right" mt="md">
            <Button type="submit">更新</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

PostUpdatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default PostUpdatePage;
