/* eslint-disable react-refresh/only-export-components */
import { lazy, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, rootRouteWithContext, useRouter, ScrollRestoration } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Verified } from '@/types';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools
        }))
      );

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      maxPages: 3,
      retry: false
    }
  }
});

const RootPage = () => {
  const { state } = useRouter();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary, error }) => (
          <div className='flex flex-col flex-1 items-center justify-center'>
            <h1 className='h1-bold'>There was an error!</h1>
            <pre className='base-medium' style={{ color: 'red' }}>
              {error.message}
            </pre>
            <Button type='button' onClick={() => resetErrorBoundary()}>
              Try again
            </Button>
          </div>
        )}>
        <main className='flex h-screen'>
          <LoadingBar isLoading={state.status === 'pending'} />
          <Outlet />
          <Toaster />
          <SpeedInsights />
          <ScrollRestoration />
          <ReactQueryDevtools initialIsOpen={false} />
          <TanStackRouterDevtools initialIsOpen={false} />
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

const LoadingBar = ({ isLoading, delay = 300 }: { isLoading: boolean; delay?: number }) => {
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
        <div className='after:absolute after:top-0 after:left-0 after:z-[100] after:w-[100%] after:h-[3px] after:animate-pulse after:bg-primary' />
      )}
    </>
  );
};

export const rootRoute = rootRouteWithContext<{
  queryClient: QueryClient;
  userID: string;
  userAlias: string;
  verified: Verified;
}>()({ component: RootPage });
