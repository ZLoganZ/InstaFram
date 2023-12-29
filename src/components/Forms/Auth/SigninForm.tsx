import { z } from "zod";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Shared/Loader";
import { SigninFormSchema } from "@/lib/schema";
import { useSignin } from "@/lib/hooks/mutation";
import { ErrorResponse } from "@/types";

const SigninForm = () => {
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signin, isLoadingSignin } = useSignin();

  const onSubmit = async (values: z.infer<typeof SigninFormSchema>) => {
    signin(values, {
      onError: (error) => {
        const errorResponse = error as unknown as ErrorResponse;
        switch (errorResponse.response?.status) {
          case 400:
            form.setError("email", {
              message: errorResponse.response.data?.message,
            });
            break;
          case 401:
            form.setError("password", {
              message: errorResponse.response.data?.message,
            });
            break;
          default:
            break;
        }
      },
    });
  };

  useEffect(() => {
    document.title = "Sign in - InstaFram";
  }, []);

  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-[420px]">
        <div className="flex items-center gap-1">
          <img src="/assets/images/logo.svg" alt="logo" className="size-9" />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </div>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Sign in to your account
        </h2>
        <p className="small-medium md:base-regular text-[#7878A3]">
          Welcome back, please sign in to your account
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to="/forgot"
            className="subtle-medium md:small-medium line-clamp-1 text-center text-primary hover:underline"
          >
            Forgot your password?
          </Link>

          <Button type="submit" disabled={isLoadingSignin}>
            {isLoadingSignin ? (
              <div className="flex-center gap-2">
                <Loader />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="small-regular md:base-regular mt-2 text-center text-dark-2 dark:text-light-2">
            Don&apos;t have an account yet?&nbsp;
            <Link
              to="/signup"
              className="small-semibold md:base-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
