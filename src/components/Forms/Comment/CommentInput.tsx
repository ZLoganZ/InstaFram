import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XCircle } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CommentSchema } from '@/lib/schema';
import { getImageURL } from '@/lib/utils';
import { useCommentPost } from '@/lib/hooks/mutation';
import { IReplyTo, IUser } from '@/types';

interface ICommentInputProps {
  postID: string;
  currentUser: IUser;
  replyTo: IReplyTo | undefined;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
}

const CommentInput = ({ currentUser, postID, replyTo, setReplyTo }: ICommentInputProps) => {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: ''
    }
  });

  const { commentPost, isLoadingCommentPost } = useCommentPost();

  const onSubmit = async (values: z.infer<typeof CommentSchema>) => {
    await commentPost(
      { ...values, post: postID, replyTo: replyTo?.to },
      {
        onSuccess: () => {
          form.reset();
        }
      }
    );
  };

  return (
    <Form {...form}>
      <form
        className='w-full max-w-5xl flex-center border rounded-[2rem] bg-light-2 dark:bg-dark-2 gap-3 
        border-light-4 dark:border-dark-4 px-4 py-3 max-xs:flex-col'
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <img
                  className='rounded-full object-cover size-12'
                  src={getImageURL(currentUser.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                  alt='user_image'
                />
              </FormLabel>
              <div className='flex flex-col w-full'>
                {replyTo && (
                  <div className='flex items-center gap-1'>
                    <p className='subtle-semibold'>Replying to</p>
                    <p className='subtle-semibold text-primary'>{replyTo.user.name}</p>
                    <XCircle className='cursor-pointer size-4' onClick={() => setReplyTo(undefined)} />
                  </div>
                )}
                <FormControl className='border-none bg-transparent'>
                  <Input
                    type='text'
                    autoComplete='off'
                    placeholder='Write a comment...'
                    className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 outline-none'
                    {...field}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isLoadingCommentPost}
          className='rounded-3xl bg-primary px-5 py-2 small-regular max-xs:w-full'>
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default CommentInput;
