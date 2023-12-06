import { Route, lazyRouteComponent } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';

export const AuthRoute = new Route({
  id: 'auth',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/layouts/AuthLayout')),
  wrapInSuspense: true
});

export const SigninRoute = new Route({
  path: '/signin',
  getParentRoute: () => AuthRoute,
  component: lazyRouteComponent(() => import('@/components/Forms/Auth/SigninForm'))
});

export const SignupRoute = new Route({
  path: '/signup',
  getParentRoute: () => AuthRoute,
  component: lazyRouteComponent(() => import('@/components/Forms/Auth/SignupForm'))
});

export const NotFoundRoute = new Route({
  path: '*',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/pages/NotFound')),
  wrapInSuspense: true
});
