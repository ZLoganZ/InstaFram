import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog';
import { useLikePost, useSavePost } from '@/lib/hooks/mutation';
import { cn, getImageURL } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { IPost } from '@/types';

interface IPostStats {
  post: IPost;
  textWhite?: boolean;
}

const PostStats = ({ post, textWhite = false }: IPostStats) => {
  const { likePost } = useLikePost();
  const { savePost } = useSavePost();

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  const [likes, setLikes] = useState(post.likes.map((like) => like._id));
  const [isSaved, setIsSaved] = useState(post.saves.some((save) => save.user._id === currentUser._id));

  useEffect(() => {
    setLikes(post.likes.map((like) => like._id));
    setIsSaved(post.saves.some((save) => save.user._id === currentUser._id));
  }, [post]);

  const handleLikePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const hasLiked = likes.includes(currentUser._id);

      if (hasLiked) {
        setLikes(likes.filter((like) => like !== currentUser._id));
      } else {
        setLikes([...likes, currentUser._id]);
      }

      likePost(post._id);
    },
    [likes, currentUser._id, likePost, post._id]
  );

  const handleSavePost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      setIsSaved(!isSaved);

      savePost(post._id);
    },
    [isSaved, savePost, post._id]
  );

  const checkIsLiked = useMemo(() => {
    return likes.includes(currentUser._id);
  }, [likes, currentUser._id]);

  const isPostPage = useMemo(() => {
    return location.pathname.includes('post');
  }, [location]);

  const handleClickComment = useCallback(() => {
    if (isPostPage) return;
    navigate({
      to: '/post/$postID',
      params: {
        postID: post._id
      }
    });
  }, [navigate, post._id, location]);

  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-2 mr-2'>
        <div className='flex gap-1.5'>
          <img
            className='w-5 h-5 cursor-pointer hover:scale-110'
            src={checkIsLiked ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
            alt='like'
            onClick={handleLikePost}
          />
          <Dialog modal>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <p
                      className={cn(
                        'small-medium lg:base:medium cursor-pointer hover:underline',
                        textWhite && 'text-white'
                      )}>
                      {likes.length}
                    </p>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>
                  <ul className='flex flex-col gap-2'>
                    {post.likes.length === 0 ? (
                      <li className='flex items-center'>
                        <p className='small-regular'>No one has liked this post yet</p>
                      </li>
                    ) : (
                      post.likes.slice(0, 10).map((like) => (
                        <li key={like._id}>
                          <Link
                            to='/profile/$profileID'
                            params={{ profileID: like.alias || like._id }}
                            className='flex items-center gap-2.5 group'>
                            <img
                              src={
                                getImageURL(like.image, 'miniAvatar') ||
                                '/assets/icons/profile-placeholder.svg'
                              }
                              alt='avatar'
                              className='w-8 h-8 rounded-full'
                            />
                            <p className='small-regular group-hover:underline'>{like.name}</p>
                          </Link>
                        </li>
                      ))
                    )}
                    {post.likes.length > 10 && (
                      <li className='flex items-center'>
                        <p className='small-regular'>and {post.likes.length - 10} more...</p>
                      </li>
                    )}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className='max-w-md'>
              <DialogHeader className='flex justify-start w-full'>
                <DialogTitle className='flex-start gap-3'>
                  <img src='/assets/icons/like.svg' alt='likes' className='w-9 h-9' />
                  <h2 className='h3-bold md:h2-bold text-left w-full'>Likes</h2>
                </DialogTitle>
                <DialogDescription>
                  {post.likes.length === 0
                    ? 'No one has liked this post yet'
                    : post.likes.length === 1
                    ? '1 person likes this post'
                    : `${post.likes.length} people like this post`}
                </DialogDescription>
              </DialogHeader>
              <ul className='flex flex-col gap-5 max-h-[40rem] custom-scrollbar overflow-auto'>
                {post.likes.length !== 0 &&
                  post.likes.map((like) => (
                    <li key={like._id}>
                      <Link
                        to='/profile/$profileID'
                        params={{ profileID: like.alias || like._id }}
                        className='flex items-center gap-4'>
                        <img
                          src={
                            getImageURL(like.image, 'miniAvatar') || '/assets/icons/profile-placeholder.svg'
                          }
                          alt='avatar'
                          className='w-12 h-12 rounded-full'
                        />
                        <div className='flex flex-col'>
                          <p className='base-regular hover:underline'>{like.name}</p>
                          <p className='small-regular text-[#7878A3]'>@{like.alias}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>

        <div className={cn('flex gap-1.5', !isPostPage && 'cursor-pointer')} onClick={handleClickComment}>
          <img src='/assets/icons/comment.svg' alt='comment' className='w-5 h-5' />
          <p className={cn('small-medium lg:base:medium', textWhite && 'text-white')}>
            {post.comments.length}
          </p>
        </div>
      </div>

      <img
        src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
        alt='save'
        className='w-5 h-5 cursor-pointer'
        onClick={handleSavePost}
      />
    </div>
  );
};

export default PostStats;
