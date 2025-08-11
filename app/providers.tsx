"use client";
import React from "react";
import { ProgressProvider } from "@bprogress/next/app";

interface Props {
  children: React.ReactNode;
}

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Provider } from "jotai";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const Providers: React.FC<Props> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <ProgressProvider
            height="3px"
            color="#009a44"
            options={{ showSpinner: false }}
            shallowRouting
          >
            {children}
          </ProgressProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
