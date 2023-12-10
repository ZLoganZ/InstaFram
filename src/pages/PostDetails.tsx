import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useRouter } from '@tanstack/react-router';

import { useGetCommentsByPostID, useGetPost, useGetRelatedPosts } from '@/lib/hooks/query';
import { useDeletePost } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { FILTERS } from '@/lib/constants';
import { getDateTimeToNow, getImageURL } from '@/lib/utils';
import { PostDetailsRoute } from '@/routes/private.routes';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Shared/Loader';
import CommentsList from '@/components/Comment/CommentsList';
import PostStats from '@/components/Post/PostStats';
import GridPostsList from '@/components/Post/GridPostsList';
import PostOptions from '@/components/Post/PostOptions';
import CommentInput from '@/components/Forms/Comment/CommentInput';

const PostDetails = () => {
  const { postID } = useParams({ from: PostDetailsRoute.id });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const { post, isLoadingPost } = useGetPost(postID);
  const { relatedPosts, isLoadingRelatedPosts } = useGetRelatedPosts(postID);

  const { comments, isLoadingComments } = useGetCommentsByPostID(postID);

  const { deletePost } = useDeletePost();

  const [replyTo, setReplyTo] = useState<string>();

  const handleDeletePost = () => {
    deletePost(postID, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Post deleted successfully'
        });
        router.history.back();
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
      {isLoadingPost ? (
        <Loader />
      ) : (
        <>
          <div className='hidden md:flex max-w-5xl w-full'>
            <Button onClick={() => router.history.back()} className='gap-2' variant='ghost'>
              <img src='/assets/icons/back.svg' alt='back' width={24} height={24} />
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
                <Link
                  className='flex items-center gap-3'
                  to='/profile/$profileID'
                  params={{ profileID: post.creator.alias || post.creator._id }}>
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

              <div className='flex flex-1 flex-col w-full small-medium lg:base-regular'>
                <p>{post.content}</p>
                <ul className='flex flex-wrap gap-1.5 mt-2'>
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className='text-[#7878A3] cursor-pointer hover:underline'
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
                <PostStats post={post} userID={currentUser._id} />
              </div>
            </div>
          </div>

          <CommentsList
            commentsCount={post.comments.length}
            comments={comments}
            isLoadingComments={isLoadingComments}
            setReplyTo={setReplyTo}
          />

          <CommentInput currentUser={currentUser} postID={postID} replyTo={replyTo} />

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
