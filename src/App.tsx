import { RouterProvider } from '@tanstack/react-router';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { router } from '@/routes/router';

import { useAuth } from '@/lib/hooks/useAuth';
import { Verified } from '@/types';

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
