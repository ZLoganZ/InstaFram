import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useGetPost, useGetRelatedPosts } from '@/lib/hooks/query';
import { useDeletePost } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { cn, getDateTimeToNow, getImageURL } from '@/lib/utils';
import { GridPostsList, Loader, PostStats } from '@/components/Shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { EditPost } from '@/pages';

const PostDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const { post, isLoadingPost } = useGetPost(id ?? '');
  const { relatedPosts, isLoadingRelatedPosts } = useGetRelatedPosts(id ?? '');

  const { deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost(post._id, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Post deleted successfully'
        });
        navigate(-1);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message
        });
      }
    });
  };

  useEffect(() => {
    if (post) document.title = `${post.content.slice(0, 45)} - InstaFram`;
  }, [post]);

  return (
    <div className='flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center'>
      <div className='hidden md:flex max-w-5xl w-full'>
        <Button onClick={() => navigate(-1)} className='gap-2' variant='ghost'>
          <img src='/assets/icons/back.svg' alt='back' width={24} height={24} />
          <p className='small-medium lg:base-medium'>Back</p>
        </Button>
      </div>

      {isLoadingPost ? (
        <Loader />
      ) : (
        <div className='bg-light-2 dark:bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-light-4 dark:border-dark-4 xl:rounded-l-[24px]'>
          <img
            src={getImageURL(post.image, 'post')}
            alt='post'
            className='h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-light-2 dark:bg-dark-2'
          />
          <div className='bg-light-2 dark:bg-dark-2 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]'>
            <div className='flex-between w-full'>
              <Link to={`/profile/${post.creator._id}`} className='flex items-center gap-3'>
                <img
                  className='w-8 h-8 lg:h-12 lg:w-12 rounded-full'
                  src={getImageURL(post.creator.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                  alt='avatar'
                />
                <div className='flex flex-col'>
                  <p className='base-medium lg:body-bold hover:underline'>{post.creator.name}</p>
                  <div className='flex-center gap-1 text-[#7878A3]'>
                    <p className='subtle-semibold lg:small-regular hover:underline'>
                      {getDateTimeToNow(post.createdAt)}
                    </p>
                    -<p className='subtle-semibold lg:small-regular hover:underline'>{post.location}</p>
                  </div>
                </div>
              </Link>

              <div className={cn('flex-center gap-4', currentUser._id !== post.creator._id && '!hidden')}>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button asChild variant='ghost' className='p-0 flex hover:bg-transparent cursor-pointer'>
                      <img src='/assets/icons/edit.svg' alt='edit' className='h-6 w-6' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-lg lg:max-w-5xl h-full'>
                    <EditPost setOpen={setOpen} />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button asChild variant='ghost' className='p-0 flex hover:bg-transparent'>
                      <img src='/assets/icons/delete.svg' alt='delete' className='h-6 w-6' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <hr className='border w-full border-light-4/80 dark:border-dark-4/80' />

            <div className='flex flex-1 flex-col w-full small-medium lg:base-regular'>
              <p>{post.content}</p>
              <ul className='flex flex-wrap gap-1.5 mt-2'>
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className='text-[#7878A3] cursor-pointer hover:underline'
                    onClick={() => navigate(`/explore?search=${tag}`)}>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className='w-full'>
              <PostStats post={post} userID={currentUser._id} />
            </div>
          </div>
        </div>
      )}

      <div className='w-full max-w-5xl'>
        <h3 className='body-bold md:h3-bold w-full my-10'>More Related Posts</h3>
        {isLoadingRelatedPosts || !relatedPosts ? <Loader /> : <GridPostsList posts={relatedPosts} />}
      </div>
    </div>
  );
};

export default PostDetails;
