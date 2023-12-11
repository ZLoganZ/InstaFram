import { RouterProvider } from '@tanstack/react-router';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { router } from '@/routes/router';
import { useAuth } from '@/lib/hooks/useAuth';

const App = () => {
  const { currentUser } = useAuth();
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} context={{ userID: currentUser._id }} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
