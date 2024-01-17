import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommentSchema } from "@/lib/schema";
import { getImageURL } from "@/lib/utils";
import { useCommentPost } from "@/lib/hooks/mutation";
import { IReplyTo, IUser } from "@/types";

interface ICommentInputProps {
  postID: string;
  currentUser: IUser;
  replyTo: IReplyTo | undefined;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
}

const CommentInput = ({
  currentUser,
  postID,
  replyTo,
  setReplyTo,
}: ICommentInputProps) => {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { commentPost, isLoadingCommentPost } = useCommentPost();

  const onSubmit = async (values: z.infer<typeof CommentSchema>) => {
    await commentPost(
      { ...values, post: postID, replyTo: replyTo?.to },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        className="flex-center w-full max-w-5xl gap-3 rounded-[2rem] border border-light-4 bg-light-2 
        px-4 py-3 dark:border-dark-4 dark:bg-dark-2 max-xs:flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <img
                  className="size-12 rounded-full object-cover"
                  src={
                    getImageURL(currentUser.image, "avatar") ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="user_image"
                />
              </FormLabel>
              <div className="flex w-full flex-col">
                {replyTo && (
                  <div className="flex items-center gap-1">
                    <p className="small-semibold">Replying to</p>
                    <p className="small-semibold text-primary">
                      {replyTo.user.name}
                    </p>
                    <XCircle
                      className="size-4 cursor-pointer"
                      onClick={() => setReplyTo(undefined)}
                    />
                  </div>
                )}
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Write a comment..."
                    className="outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoadingCommentPost}
          className="small-regular rounded-3xl bg-primary px-5 py-2 max-xs:w-full"
        >
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default CommentInput;
