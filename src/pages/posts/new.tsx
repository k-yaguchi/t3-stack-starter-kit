import { useRouter } from "next/router";
import type { ReactElement } from "react";
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
  title: z.string().min(1, { message: "必須です" }),
  text: z.string().min(1, { message: "必須です" }),
});

export type Post = z.infer<typeof postSchema>;

const PostNewPage: NextPageWithLayout = () => {
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(postSchema),
    initialValues: {
      title: "",
      text: "",
    },
  });

  const postCreateMutation = api.posts.create.useMutation();

  const handleSubmit = async (values: Post) => {
    await postCreateMutation.mutateAsync(values);
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
            <Button type="submit">登録</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

PostNewPage.getLayout = function getLayout(page: ReactElement) {
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

export default PostNewPage;
