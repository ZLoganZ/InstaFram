/* eslint-disable react-refresh/only-export-components */
import { lazy, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
  ScrollRestoration,
} from "@tanstack/react-router";
import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Verified } from "@/types";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  },
});

const RootPage = () => {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const { reset } = useQueryErrorResetBoundary();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary, error }) => (
          <div className="flex flex-1 flex-col items-center justify-center">
            <h1 className="h1-bold">There was an error!</h1>
            <pre className="base-medium" style={{ color: "red" }}>
              {error.message}
            </pre>
            <Button type="button" onClick={() => resetErrorBoundary()}>
              Try again
            </Button>
          </div>
        )}
      >
        <main className="flex h-dvh">
          <LoadingBar isLoading={isLoading} />
          <Outlet />
          <Toaster />
          <Analytics />
          <SpeedInsights />
          <ScrollRestoration />
          <ReactQueryDevtools initialIsOpen={false} />
          <TanStackRouterDevtools initialIsOpen={false} />
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

const LoadingBar = ({
  isLoading,
  delay = 300,
}: {
  isLoading: boolean;
  delay?: number;
}) => {
  const [showBar, setShowBar] = useState(false);
  const timeoutID = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isLoading) {
      timeoutID.current = setTimeout(() => {
        if (isLoading) {
          setShowBar(true);
        }
      }, delay);
    } else {
      clearTimeout(timeoutID.current);
      if (showBar) {
        setTimeout(() => setShowBar(false), 1000 - delay);
      }
    }

    return () => {
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
      }
    };
  });

  return (
    <>
      {showBar && (
        <div className="after:absolute after:left-0 after:top-0 after:z-[100] after:h-[3px] after:w-[100%] after:animate-pulse after:bg-primary" />
      )}
    </>
  );
};

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
  userID: string;
  userAlias: string;
  verified: Verified;
}>()({ component: RootPage });
