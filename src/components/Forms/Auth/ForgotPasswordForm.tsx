import { z } from "zod";
import { useEffect, useState } from "react";
import { Link, useNavigate, getRouteApi } from "@tanstack/react-router";
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
import {
  useCheckEmailForgotPassword,
  useVerifyCode,
} from "@/lib/hooks/mutation";
import { ForgotPasswordSchema } from "@/lib/schema";
import { ErrorResponse } from "@/types";

const routeApi = getRouteApi("/auth/forgot");

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const navigate = useNavigate();
  const { verified } = routeApi.useRouteContext();

  const { setIsVerified } = verified;

  const [showVerifyCode, setShowVerifyCode] = useState(false);

  const { checkEmailForgotPassword, isLoadingCheckEmailForgotPassword } =
    useCheckEmailForgotPassword();
  const { verifyCode, isLoadingVerifyCode } = useVerifyCode();

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    if (showVerifyCode) {
      verifyCode(values, {
        onSuccess: () => {
          form.reset();
          setShowVerifyCode(false);
          setIsVerified(true);

          const array = new Uint32Array(64);
          window.crypto.getRandomValues(array);
          const token = Array.from(array)
            .map((n) => n.toString(16))
            .join("");
          navigate({
            to: "/reset",
            search: {
              email: values.email,
              token: token,
            },
            replace: true,
          });
        },
        onError: (error) => {
          const errorResponse = error as ErrorResponse;
          switch (errorResponse.response.data.message) {
            case "Code is invalid":
              form.setError("code", {
                message: "Code is invalid",
              });
              break;
            default:
              break;
          }
        },
      });
    } else {
      await checkEmailForgotPassword(values.email, {
        onSuccess: () => {
          setShowVerifyCode(true);
        },
        onError: (error) => {
          const errorResponse = error as ErrorResponse;
          switch (errorResponse.response.data.message) {
            case "Email is not exist":
              form.setError("email", {
                message: "Email is not exist",
              });
              break;
            default:
              break;
          }
        },
      });
    }
  };

  useEffect(() => {
    document.title = "Forgot password - InstaFram";
  }, []);

  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-[420px]">
        <div className="flex items-center gap-1">
          <img src="/assets/images/logo.svg" alt="logo" className="size-9" />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </div>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Forgot your password
        </h2>
        <p className="small-medium md:base-regular text-[#7878A3]">
          Enter your email to reset your password
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
                  <Input
                    type="email"
                    placeholder="Your email"
                    {...field}
                    readOnly={showVerifyCode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showVerifyCode && (
            <>
              <span className="subtle-regular md:small-regular text-center">
                <p>
                  We just sent you a
                  <span className="subtle-semibold md:small-semibold">
                    {" "}
                    verification code
                  </span>{" "}
                  to your email.
                </p>
                <p>
                  Please check your inbox. Can't find it?&nbsp;
                  <span
                    className="cursor-pointer text-primary underline"
                    onClick={() => {
                      setShowVerifyCode(false);
                      form.reset();
                    }}
                  >
                    Try again
                  </span>
                </p>
              </span>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={isLoadingVerifyCode || isLoadingCheckEmailForgotPassword}
          >
            {isLoadingVerifyCode || isLoadingCheckEmailForgotPassword ? (
              <div className="flex-center gap-2">
                <Loader />
                {showVerifyCode ? "Submitting..." : "Verifying email..."}
              </div>
            ) : showVerifyCode ? (
              "Submit"
            ) : (
              "Verify email"
            )}
          </Button>

          <p className="small-regular md:base-regular mt-2 text-center text-dark-2 dark:text-light-2">
            Already remember your password?&nbsp;
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

export default ForgotPasswordForm;
