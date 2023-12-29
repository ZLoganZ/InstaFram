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
import { useSignup } from "@/lib/hooks/mutation";
import { SignupFormSchema } from "@/lib/schema";
import { ErrorResponse } from "@/types";

const SignupForm = () => {
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      alias: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { signup, isLoadingSignup } = useSignup();

  const onSubmit = async (values: z.infer<typeof SignupFormSchema>) => {
    await signup(values, {
      onError: (error) => {
        const errorResponse = error as ErrorResponse;
        switch (errorResponse.response.data.message) {
          case "Email is already exist":
            form.setError("email", {
              message: "Email is already exist",
            });
            break;
          case "Alias is already used":
            form.setError("alias", {
              message: "Alias is already used",
            });
            break;
          default:
            break;
        }
      },
    });
  };

  useEffect(() => {
    document.title = "Sign up - InstaFram";
  }, []);

  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-[420px]">
        <div className="flex items-center gap-1">
          <img src="/assets/images/logo.svg" alt="logo" className="size-9" />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </div>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">Create an account</h2>
        <p className="small-medium md:base-regular text-[#7878A3]">
          To start using the app, you need to create an account
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alias</FormLabel>
                <FormControl>
                  <Input placeholder="johnsmith (without spacing)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johnsmith@example.com"
                    {...field}
                  />
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
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoadingSignup}>
            {isLoadingSignup ? (
              <div className="flex-center gap-2">
                <Loader />
                Signing up...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="small-regular md:base-regular mt-2 text-center text-dark-2 dark:text-light-2">
            Already have an account?&nbsp;
            <Link
              to="/signin"
              className="small-semibold md:base-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
