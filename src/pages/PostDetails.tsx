import { useEffect, useState } from 'react';
import { Link, useNavigate, useRouter, RouteApi } from '@tanstack/react-router';

import NotFound from '@/pages/NotFound';

import { useGetPost, useGetRelatedPosts } from '@/lib/hooks/query';
import { useDeletePost } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { FILTERS } from '@/lib/constants';
import { getDateTimeToNow, getImageURL } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Shared/Loader';
import HoverUser from '@/components/Post/HoverUser';
import CommentsList from '@/components/Comment/CommentsList';
import PostStats from '@/components/Post/PostStats';
import GridPostsList from '@/components/Post/GridPostsList';
import PostVisibility from '@/components/Post/PostVisibility';
import PostOptions from '@/components/Post/PostOptions';
import CommentInput from '@/components/Forms/Comment/CommentInput';
import { IReplyTo } from '@/types';

const routeApi = new RouteApi({ id: '/main/post/$postID' });

const PostDetails = () => {
  const { postID } = routeApi.useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { history } = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const { post, isLoadingPost, errorPost } = useGetPost(postID);
  const { relatedPosts, isLoadingRelatedPosts } = useGetRelatedPosts(postID);

  const { deletePost } = useDeletePost();

  const [replyTo, setReplyTo] = useState<IReplyTo>();

  const handleDeletePost = () => {
    deletePost(postID, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Post deleted successfully'
        });
        history.back();
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
      {errorPost ? (
        <NotFound />
      ) : isLoadingPost || !post ? (
        <Loader />
      ) : (
        <>
          <div className='hidden md:flex max-w-5xl w-full'>
            <Button onClick={() => history.back()} className='gap-2' variant='ghost'>
              <img src='/assets/icons/back.svg' alt='back' className='size-6' />
              <p className='small-medium lg:base-medium'>Back</p>
            </Button>
          </div>
          <div className='bg-light-2 dark:bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-light-4 dark:border-dark-4 xl:rounded-l-[24px]'>
            <img
              src={getImageURL(post.image, 'post')}
              alt='post'
              className='h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-light-2 dark:bg-dark-2'
            />
            <div className='bg-light-2 dark:bg-dark-2 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]'>
              <div className='flex-between w-full'>
                <div className='flex items-center gap-3'>
                  <HoverUser userID={post.creator._id} showFollowButton>
                    <Link to='/$profileID' params={{ profileID: post.creator.alias || post.creator._id }}>
                      <img
                        className='size-8 lg:size-12 rounded-full hover:ring-2 ring-primary'
                        src={
                          getImageURL(post.creator.image, 'avatar') || '/assets/icons/profile-placeholder.svg'
                        }
                        alt='avatar'
                      />
                    </Link>
                  </HoverUser>
                  <div className='flex flex-col'>
                    <HoverUser userID={post.creator._id} showFollowButton>
                      <Link to='/$profileID' params={{ profileID: post.creator.alias || post.creator._id }}>
                        <p className='base-medium lg:body-bold hover:underline line-clamp-1'>
                          {post.creator.name}
                        </p>
                      </Link>
                    </HoverUser>
                    <Link
                      to='/$profileID'
                      params={{ profileID: post.creator.alias || post.creator._id }}
                      className='flex-center gap-1 text-[#7878A3]'>
                      <PostVisibility visibility={post.visibility} />-
                      <p className='subtle-semibold lg:small-regular hover:underline line-clamp-1'>
                        {getDateTimeToNow(post.createdAt)}
                      </p>
                      -
                      <p className='subtle-semibold lg:small-regular hover:underline line-clamp-1'>
                        {post.location}
                      </p>
                    </Link>
                  </div>
                </div>

                {currentUser._id === post.creator._id && (
                  <PostOptions
                    key={postID}
                    open={open}
                    setOpen={setOpen}
                    handleDeletePost={handleDeletePost}
                  />
                )}
              </div>

              <hr className='border w-full border-light-4/80 dark:border-dark-4/80' />

              <div className='flex flex-1 flex-col w-full small-medium lg:base-regular text-pretty'>
                <p>{post.content}</p>
                <ul className='flex flex-wrap gap-1.5 mt-2'>
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className='text-[#7878A3] cursor-pointer hover:underline line-clamp-1'
                      onClick={() =>
                        navigate({
                          to: `/explore`,
                          search: (pre) => ({ ...pre, search: tag, filter: FILTERS.ALL })
                        })
                      }>
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='w-full'>
                <PostStats post={post} />
              </div>
            </div>
          </div>

          <CommentsList
            commentsCount={post.comments.length}
            postID={postID}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
          />

          <CommentInput currentUser={currentUser} postID={postID} replyTo={replyTo} setReplyTo={setReplyTo} />

          <div className='w-full max-w-5xl'>
            <h3 className='body-bold md:h3-bold w-full my-10'>More Related Posts</h3>
            {isLoadingRelatedPosts || !relatedPosts ? (
              <Loader />
            ) : relatedPosts.length === 0 ? (
              <p className='text-[#5C5C7B] mt-10 text-center w-full'>No related posts</p>
            ) : (
              <GridPostsList posts={relatedPosts} showStats showUser />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
