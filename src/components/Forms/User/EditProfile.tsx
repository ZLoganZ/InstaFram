import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Shared/Loader';
import ProfileUpload from '@/components/Upload/ProfileUpload';
import { useUpdateUser } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { UpdateUserSchema } from '@/lib/schema';
import { ErrorResponse } from '@/types';

interface IUpdateProfile {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ setOpen }: IUpdateProfile) => {
  const tempFile = new File([], '');

  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, setUser } = useAuth();
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio,
      alias: currentUser.alias,
      image: tempFile
    }
  });

  const { updateUser, isLoadingUpdateUser } = useUpdateUser();

  // Handler
  const handleUpdate = async (value: z.infer<typeof UpdateUserSchema>) => {
    let isChangeImage = false;
    if (value.image !== tempFile) {
      isChangeImage = true;
    }
    await updateUser(
      {
        ...value,
        isChangeImage
      },
      {
        onSuccess: (data) => {
          setUser({
            ...currentUser,
            ...data
          });
          setOpen(false);
          toast({
            title: 'Success',
            description: 'Profile updated successfully!'
          });
          navigate({
            to: '/$profileID',
            params: {
              profileID: data.alias || data._id
            },
            replace: true
          });
        },
        onError: (error) => {
          const errorResponse = error as ErrorResponse;
          if (errorResponse.response.data.message.toLowerCase().includes('alias')) {
            form.setError('alias', {
              message: errorResponse.response.data.message
            });
          } else {
            toast({
              title: 'Error',
              description: errorResponse.message
            });
          }
        }
      }
    );
  };

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll p-5 custom-scrollbar'>
      <DialogHeader className='flex justify-start w-full max-w-5xl'>
        <div className='flex-start gap-3'>
          <img src='/assets/icons/edit.svg' alt='edit' className='size-9' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Profile</h2>
        </div>
        <DialogDescription>
          Make changes to your profile and click save to update your profile.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdate)}
          className='flex flex-col gap-7 w-full mt-4 max-w-5xl'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem className='flex'>
                <FormControl>
                  <ProfileUpload fieldChange={field.onChange} form={form} mediaURL={currentUser.image} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='alias'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alias</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea className='custom-scrollbar resize-none' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-4 items-center justify-end w-full'>
            <Button type='button' variant='destructive' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' className='whitespace-nowrap' disabled={isLoadingUpdateUser}>
              {isLoadingUpdateUser ? (
                <div className='flex-center gap-2'>
                  <Loader />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
