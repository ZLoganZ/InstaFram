import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CommentSchema } from '@/lib/schema';
import { getImageURL } from '@/lib/utils';
import { useCommentPost } from '@/lib/hooks/mutation';
import { IUser } from '@/types';

interface ICommentInputProps {
  postID: string;
  currentUser: IUser;
  replyTo?: string;
}

const CommentInput: React.FC<ICommentInputProps> = ({ currentUser, postID, replyTo }) => {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: ''
    }
  });

  const { commentPost, isLoadingCommentPost } = useCommentPost();

  const onSubmit = async (values: z.infer<typeof CommentSchema>) => {
    await commentPost(
      { ...values, post: postID, replyTo },
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
            <FormItem className='flex-center w-full gap-3'>
              <FormLabel>
                <img
                  src={getImageURL(currentUser.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  autoComplete='off'
                  {...field}
                  placeholder='Write a comment...'
                  className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 outline-none'
                />
              </FormControl>
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
