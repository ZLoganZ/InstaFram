import { Routes, Route } from 'react-router-dom';

import { SigninForm, SignupForm } from '@/components/Forms/Auth';
import { Toaster } from '@/components/ui/toaster';

import { AuthLayout, MainLayout } from '@/layouts';

import { People, CreatePost, Explore, Home, PostDetails, Profile, NotFound } from '@/pages';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/*Public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/signin' element={<SigninForm />} />
          <Route path='/signup' element={<SignupForm />} />
        </Route>

        {/*Private routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/people' element={<People />} />
          <Route path='/posts/create' element={<CreatePost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
