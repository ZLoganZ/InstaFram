import { z } from 'zod';
import { Route, lazyRouteComponent, redirect } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';

import LoaderLogo from '@/components/Shared/LoaderLogo';

const redirectSchema = z.object({
  redirect: z.string().optional()
});

export const AuthRoute = new Route({
  id: 'auth',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/layouts/AuthLayout')),
  pendingComponent: LoaderLogo,
  beforeLoad: async ({ context }) => {
    if (context.userID) {
      throw redirect({
        to: '/',
        replace: true
      });
    }
  },
  wrapInSuspense: true
});

export const SigninRoute = new Route({
  path: '/signin',
  getParentRoute: () => AuthRoute,
  validateSearch: (search) => redirectSchema.parse(search),
  component: lazyRouteComponent(() => import('@/components/Forms/Auth/SigninForm')),
  wrapInSuspense: true
});

export const SignupRoute = new Route({
  path: '/signup',
  getParentRoute: () => AuthRoute,
  component: lazyRouteComponent(() => import('@/components/Forms/Auth/SignupForm')),
  wrapInSuspense: true
});

export const NotFoundRoute = new Route({
  path: '*',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/pages/NotFound')),
  wrapInSuspense: true
});
