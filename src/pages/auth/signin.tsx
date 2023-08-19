import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { IconAlertCircle } from "@tabler/icons-react";

export const signInValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" }),
  password: z.string().min(8, { message: "8文字以上で入力してください" }),
});

export type SignIn = z.infer<typeof signInValidationSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    validate: zodResolver(signInValidationSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignIn) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (result?.ok) {
      void router.push("/posts");
    } else {
      setError(result?.error ?? "エラーが発生しました");
      form.setValues({
        password: "",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <form
        onSubmit={form.onSubmit((values) => {
          void handleSubmit(values);
        })}
      >
        <Title align="center">T3 Stack Starter Kit</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {error && (
            <Alert color="red" variant="filled">
              {error}
            </Alert>
          )}
          <TextInput
            label="メールアドレス"
            placeholder="メールアドレスを入力してください"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力してください"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            ログイン
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default SignInPage;
