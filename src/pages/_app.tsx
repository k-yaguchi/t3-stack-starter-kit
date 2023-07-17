import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { MantineProvider } from "@mantine/core";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>T3 Stack Starter Kit</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** 'light' | 'dark' でテーマを決められます */
            colorScheme: "light",
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
