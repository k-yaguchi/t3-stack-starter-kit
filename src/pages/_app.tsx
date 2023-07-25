import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType, AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { MantineProvider } from "@mantine/core";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <title>T3 Stack Starter Kit</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider
        session={
          //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          session
        }
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** 'light' | 'dark' でテーマを決められます */
            colorScheme: "light",
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
