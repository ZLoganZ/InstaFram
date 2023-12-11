/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, rootRouteWithContext, useRouter } from '@tanstack/react-router';
import { QueryCache, QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      maxPages: 3
    }
  },
  queryCache: new QueryCache({
    onError: (_) => {}
  })
});

const RootPage = () => {
  const { state } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary, error }) => (
              <div className='flex flex-1 items-center justify-center'>
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
              <Analytics />
              <SpeedInsights />
              <ReactQueryDevtools initialIsOpen={false} />
            </main>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
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
}>()({
  component: RootPage
});
