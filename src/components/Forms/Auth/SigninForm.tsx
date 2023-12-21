import { z } from 'zod';
import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Shared/Loader';
import { SigninFormSchema } from '@/lib/schema';
import { useSignin } from '@/lib/hooks/mutation';
import { ErrorResponse } from '@/types';

const SigninForm = () => {
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { signin, isLoadingSignin } = useSignin();

  const onSubmit = async (values: z.infer<typeof SigninFormSchema>) => {
    signin(values, {
      onError: (error) => {
        const errorResponse = error as unknown as ErrorResponse;
        switch (errorResponse.response?.status) {
          case 400:
            form.setError('email', {
              message: errorResponse.response.data?.message
            });
            break;
          case 401:
            form.setError('password', {
              message: errorResponse.response.data?.message
            });
            break;
          default:
            break;
        }
      }
    });
  };

  useEffect(() => {
    document.title = 'Sign in - InstaFram';
  }, []);

  return (
    <Form {...form}>
      <div className='sm:w-[420px] flex-center flex-col'>
        <div className='flex gap-1 items-center'>
          <img src='/assets/images/logo.svg' alt='logo' height={36} />
          <p className='font-mono h2-bold select-none'>InstaFram</p>
        </div>
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-8'>Sign in to your account</h2>
        <p className='text-[#7878A3] small-medium md:base-regular'>
          Welcome back, please sign in to your account
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full mt-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Your email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Your password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to='/forgot'
            className='text-primary text-center subtle-medium md:small-medium hover:underline'>
            Forgot your password?
          </Link>

          <Button type='submit' disabled={isLoadingSignin}>
            {isLoadingSignin ? (
              <div className='flex-center gap-2'>
                <Loader />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className='text-dark-2 dark:text-light-2 small-regular md:base-regular text-center mt-2'>
            Don&apos;t have an account yet?&nbsp;
            <Link to='/signup' className='text-primary small-semibold md:base-semibold hover:underline'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
