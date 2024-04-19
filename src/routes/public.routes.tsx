import { z } from "zod";
import {
  lazyRouteComponent,
  redirect,
  createRoute,
} from "@tanstack/react-router";

import { rootRoute } from "@/routes/root.routes";

import LoaderLogo from "@/components/Shared/LoaderLogo";

const redirectSchema = z.object({
  redirect: z.string().optional(),
});

const resetSchema = z.object({
  email: z.string().optional(),
  token: z.string().optional(),
});

export const AuthRoute = createRoute({
  id: "auth",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("@/layouts/AuthLayout")),
  pendingComponent: LoaderLogo,
  beforeLoad: async ({ context: { userID } }) => {
    if (userID) {
      redirect({
        to: "/",
        replace: true,
        throw: true,
      });
    }
  },
  wrapInSuspense: true,
});

export const SigninRoute = createRoute({
  path: "/signin",
  getParentRoute: () => AuthRoute,
  validateSearch: (search) => redirectSchema.parse(search),
  component: lazyRouteComponent(
    () => import("@/components/Forms/Auth/SigninForm"),
  ),
  wrapInSuspense: true,
});

export const SignupRoute = createRoute({
  path: "/signup",
  getParentRoute: () => AuthRoute,
  component: lazyRouteComponent(
    () => import("@/components/Forms/Auth/SignupForm"),
  ),
  wrapInSuspense: true,
});

export const ForgotPasswordRoute = createRoute({
  path: "/forgot",
  getParentRoute: () => AuthRoute,
  component: lazyRouteComponent(
    () => import("@/components/Forms/Auth/ForgotPasswordForm"),
  ),
  wrapInSuspense: true,
});

export const ResetPasswordRoute = createRoute({
  path: "/reset",
  getParentRoute: () => AuthRoute,
  validateSearch: (search) => resetSchema.parse(search),
  component: lazyRouteComponent(
    () => import("@/components/Forms/Auth/ResetPasswordForm"),
  ),
  beforeLoad: async ({ context: { verified } }) => {
    if (!verified.isVerified) {
      redirect({
        to: "/forgot",
        replace: true,
        throw: true,
      });
    }
  },
  wrapInSuspense: true,
});

export const NotFoundRoute = createRoute({
  path: "*",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("@/pages/NotFound")),
  wrapInSuspense: true,
});
