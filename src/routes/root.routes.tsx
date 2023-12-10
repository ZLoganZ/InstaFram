/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { Outlet, rootRouteWithContext, useRouter } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryCache, QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/hooks/useToast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      maxPages: 3 // Keep 3 pages worth of queries cached
    }
  },
  queryCache: new QueryCache({
    onError: (err) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useToast().toast({
        title: 'Error',
        description: err.message
      });
    }
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
            <AuthProvider>
              <ThemeProvider>
                <main className='flex h-screen'>
                  <LoadingBar isLoading={state.status === 'pending'} />
                  <Outlet />
                  <Toaster />
                  <TanStackRouterDevtools initialIsOpen={false} />
                  <ReactQueryDevtools initialIsOpen={false} />
                </main>
              </ThemeProvider>
            </AuthProvider>
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
    // If a page is loading...
    if (isLoading) {
      // Wait to see if the page takes more than the delay time to load
      timeoutID.current = setTimeout(() => {
        // If still loading after waiting then show the bar
        if (isLoading) {
          setShowBar(true);
        }
      }, delay);
    }

    // If a page completed loading...
    else {
      // Clear the delay timer
      clearTimeout(timeoutID.current);
      // If the bar is currently shown
      if (showBar) {
        // Continue to show it to at least have the bar hit 100% once.
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

export const rootRoute = rootRouteWithContext<{ queryClient: QueryClient }>()({ component: RootPage });
