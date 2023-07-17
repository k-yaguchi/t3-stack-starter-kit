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

export const postSchema = z.object({
  title: z.string().min(1, { message: "必須です" }),
  text: z.string().min(1, { message: "必須です" }),
});

export type Post = z.infer<typeof postSchema>;

const PostNewPage = () => {
  const form = useForm({
    validate: zodResolver(postSchema),
    initialValues: {
      title: "",
      text: "",
    },
  });

  const postCreateMutation = api.posts.create.useMutation();

  const handleSubmit = async (values: Post) => {
    const createdPost = await postCreateMutation.mutateAsync(values);
    console.log(createdPost);
  };

  return (
    <Container>
      <Paper p="md" m="md" shadow="md">
        <form
          onSubmit={form.onSubmit((values) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleSubmit(values);
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

export default PostNewPage;
