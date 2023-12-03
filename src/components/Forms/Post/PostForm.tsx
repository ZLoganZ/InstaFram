import { z } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToastAction } from '@/components/ui/toast';
import { ComboBox, FileUpload, Loader } from '@/components/Shared';
import { PostFormSchema } from '@/lib/schema';
import { useCreatePost, useUpdatePost } from '@/lib/hooks/mutation';
import { useToast } from '@/lib/hooks/useToast';
import { useAuth } from '@/lib/hooks/useAuth';
import { IDataComboBox, ILocationResponse, IPost } from '@/types';

interface IPostForm {
  post?: IPost;
  action: 'create' | 'edit';
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostForm: React.FC<IPostForm> = ({ post, action, setOpen }) => {
  const tempFile = useMemo(() => new File([], post ? post.image : ''), []);

  const form = useForm<z.infer<typeof PostFormSchema>>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      location: post ? post.location : '',
      tags: post ? post.tags.join(', ') : '',
      content: post ? post.content : '',
      image: tempFile
    }
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { createPost } = useCreatePost();
  const { updatePost } = useUpdatePost();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<IDataComboBox[] | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await fetch('https://restcountries.com/v3.1/all?fields=name').then(async (res) => {
        const data: ILocationResponse[] = await res.json();
        return data
          .map((location) => {
            return {
              label: location.name.common,
              value: location.name.common.toLowerCase()
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      });

      setLocationData(locationData);
    };

    fetchLocation();
  }, []);

  const onSubmit = async (values: z.infer<typeof PostFormSchema>) => {
    let isChangeImage = false;

    setIsLoading(true);
    if (action === 'create') {
      await createPost(
        { ...values, creator: currentUser._id },
        {
          onError: () => {
            setIsLoading(false);
            toast({
              title: 'Uh oh! Something went wrong!!',
              description: 'There was a problem when creating your post.',
              action: <ToastAction altText='Try again'>Try again</ToastAction>
            });
          },
          onSuccess: () => {
            setIsLoading(false);
            toast({
              title: 'Success',
              description: 'Post created successfully'
            });
            navigate('/', { replace: true });
          }
        }
      );
    } else {
      if (values.image !== tempFile) {
        isChangeImage = true;
      }

      await updatePost(
        { ...values, postID: post!._id, isChangeImage, image: isChangeImage ? values.image : undefined },
        {
          onError: () => {
            setIsLoading(false);
            toast({
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem when updating your post.',
              action: (
                <ToastAction altText='Try again' onClick={form.handleSubmit(onSubmit)}>
                  Try again
                </ToastAction>
              )
            });
          },
          onSuccess: () => {
            setIsLoading(false);
            toast({
              title: 'Success',
              description: 'Post updated successfully'
            });
            setOpen!(false);
          }
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-9 w-full max-w-5xl'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea className='custom-scrollbar' placeholder='What do you want to share?' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add photo</FormLabel>
              <FormControl>
                <FileUpload fieldChange={field.onChange} form={form} mediaURL={post?.image} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='mr-2'>Add Location</FormLabel>
              <FormControl>
                <ComboBox
                  onSelect={field.onChange}
                  placeholder='Select a location'
                  searchPlaceholder='Search for a location'
                  defaultValue={field.value.toLowerCase()}
                  buttonClassName='flex'
                  data={locationData ?? []}
                  notFound='No location found.'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Tags (separated by comma ", ")</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Javascript, React, Node,...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-center justify-end'>
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              action === 'create' || !setOpen ? navigate(-1) : setOpen(false);
            }}>
            Cancel
          </Button>
          <Button type='submit' className='whitespace-nowrap' disabled={isLoading}>
            {isLoading ? (
              <div className='flex-center gap-2'>
                <Loader />
                {action === 'create' ? 'Creating...' : 'Saving...'}
              </div>
            ) : action === 'create' ? (
              'Create'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
