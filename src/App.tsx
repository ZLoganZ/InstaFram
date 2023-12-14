import { RouterProvider, Router } from '@tanstack/react-router';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { rootRoute, queryClient } from '@/routes/root.routes';
import {
  MainRoute,
  HomeRoute,
  ExploreRoute,
  PeopleRoute,
  CreatePostRoute,
  PostDetailsRoute,
  ProfileRoute,
  UserPostsRoute,
  LikedPostsRoute,
  SavedPostsRoute
} from '@/routes/private.routes';
import {
  AuthRoute,
  SigninRoute,
  SignupRoute,
  NotFoundRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute
} from '@/routes/public.routes';

import Loader from '@/components/Shared/Loader';

import { useAuth } from '@/lib/hooks/useAuth';
import { Verified } from '@/types';

const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([SigninRoute, SignupRoute, ForgotPasswordRoute, ResetPasswordRoute]),
  MainRoute.addChildren([
    HomeRoute,
    ExploreRoute,
    PeopleRoute,
    CreatePostRoute,
    PostDetailsRoute,
    ProfileRoute.addChildren([UserPostsRoute, LikedPostsRoute, SavedPostsRoute])
  ]),
  NotFoundRoute
]);

const router = new Router({
  routeTree,
  defaultPendingComponent: Loader,
  context: { queryClient, userID: undefined!, userAlias: undefined!, verified: undefined! }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const verified: Verified = {
  isVerified: false,
  setIsVerified: (isVerified: boolean) => {
    verified.isVerified = isVerified;
  }
};

const App = () => {
  const { currentUser } = useAuth();

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider
          router={router}
          context={{ userID: currentUser._id, userAlias: currentUser.alias, verified }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
