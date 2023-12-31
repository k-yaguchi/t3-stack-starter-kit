import { useRouter } from "next/router";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import {
  AppShell,
  Navbar,
  NavLink,
  Header,
  Text,
  Group,
  ActionIcon,
  Divider,
} from "@mantine/core";
import {
  IconFileDescription,
  IconUsers,
  IconLogout,
} from "@tabler/icons-react";

interface Props {
  children: ReactNode;
}
export const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow>
            <NavLink
              label="ユーザー"
              icon={<IconUsers size="1rem" stroke={1.5} />}
              active={router.pathname.startsWith("/users")}
              component={Link}
              href="#"
            />
            <NavLink
              label="投稿"
              icon={<IconFileDescription size="1rem" stroke={1.5} />}
              active={router.pathname.startsWith("/posts")}
              component={Link}
              href="/posts"
            />
            <NavLink
              label="レポート"
              icon={<IconUsers size="1rem" stroke={1.5} />}
              active={router.pathname.startsWith("/reports")}
              component={Link}
              href="#"
            />
          </Navbar.Section>
          <Navbar.Section>
            <Divider my="sm" />
            <Group position="apart" mx="sm">
              <Text>{session?.user?.name ?? "ユーザー名無し"}</Text>
              <ActionIcon
                variant="default"
                onClick={() => {
                  if (!confirm(`ログアウトしますか？`)) {
                    return;
                  }
                  void signOut();
                }}
              >
                <IconLogout size="1rem" />
              </ActionIcon>
            </Group>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Text fz="xl" fw={700} component={Link} href="/">
            T3 Stack Starter Kit
          </Text>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      zIndex={5}
    >
      {children}
    </AppShell>
  );
};
