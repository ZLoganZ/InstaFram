/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { Outlet, RootRoute, useRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } } });

const RootPage = () => {
  const { state } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

const LoadingBar = ({ isLoading, delay = 100 }: { isLoading: boolean; delay?: number }) => {
  const [showBar, setShowBar] = useState(false);
  const delayTimerID = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // If a page is loading...
    if (isLoading) {
      // Wait to see if the page takes more than 300ms
      delayTimerID.current = setTimeout(() => {
        // If still loading after waiting then show the bar
        if (isLoading) {
          setShowBar(true);
        }
      }, delay);
    }

    // If a page completed loading...
    else {
      // Clear the delay timer
      clearTimeout(delayTimerID.current);
      // If the bar is currently shown
      if (showBar) {
        // Continue to show it to at least have the bar hit 100% once.
        setTimeout(() => setShowBar(false), 1000 - delay);
      }
    }

    return () => {
      if (delayTimerID.current) {
        clearTimeout(delayTimerID.current);
      }
    };
  });

  return (
    <>
      {showBar && (
        <div className='after:absolute after:top-0 after:left-0 after:z-[100] after:w-[100%] after:h-0.5 after:animate-pulse after:bg-primary'></div>
      )}
    </>
  );
};

export const rootRoute = new RootRoute({ component: RootPage });
