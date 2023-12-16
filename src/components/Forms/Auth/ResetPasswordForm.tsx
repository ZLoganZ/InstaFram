import { z } from 'zod';
import { Link, useNavigate, RouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Shared/Loader';
import { useResetPassword } from '@/lib/hooks/mutation';
import { useToast } from '@/lib/hooks/useToast';
import { ResetPasswordSchema } from '@/lib/schema';
import { ErrorResponse } from '@/types';

const routeApi = new RouteApi({ id: '/auth/reset' });

const ResetPasswordForm = () => {
  const { email } = routeApi.useSearch();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: ''
    }
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const { resetPassword, isLoadingResetPassword } = useResetPassword();

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    resetPassword(
      { ...values, email: email! },
      {
        onSuccess: () => {
          form.reset();
          navigate({ to: '/signin', replace: true });
          toast({
            title: 'Success',
            description: 'Password reset successfully!'
          });
        },
        onError: (error) => {
          const errorResponse = error as ErrorResponse;
          toast({
            title: 'Error',
            description: errorResponse.response.data.message
          });
        }
      }
    );
  };

  return (
    <Form {...form}>
      <div className='sm:w-[420px] flex-center flex-col'>
        <div className='flex gap-1 items-center'>
          <img src='/assets/images/logo.svg' alt='logo' height={36} />
          <p className='font-mono h2-bold select-none'>InstaFram</p>
        </div>
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-8'>Reset your password</h2>
        <p className='text-[#7878A3] small-medium md:base-regular'>
          Enter your new password to reset your password
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full mt-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Your new password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Confirm your new password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isLoadingResetPassword}>
            {isLoadingResetPassword ? (
              <>
                <Loader />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <p className='small-regular md:base-regular text-dark-2 dark:text-light-2 text-center mt-2'>
            Already remember your password?&nbsp;
            <Link to='/signin' className='text-primary small-semibold md:base-semibold hover:underline'>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
