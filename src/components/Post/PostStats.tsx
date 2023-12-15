import { Link } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLikePost, useSavePost } from '@/lib/hooks/mutation';
import { cn, getImageURL } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { IPost } from '@/types';

interface IPostStats {
  post: IPost;
  textWhite?: boolean;
}

const PostStats: React.FC<IPostStats> = ({ post, textWhite = false }) => {
  const { likePost } = useLikePost();
  const { savePost } = useSavePost();

  const { currentUser } = useAuth();

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
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className={cn(
                    'small-medium lg:base:medium cursor-pointer hover:underline',
                    textWhite && 'text-white'
                  )}>
                  {likes.length}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <ul className='flex flex-col gap-2'>
                  {post.likes.length === 0 ? (
                    <li className='flex items-center'>
                      <p className='small-regular'>No one has liked this post yet</p>
                    </li>
                  ) : (
                    post.likes.slice(0, 10).map((like) => (
                      <li key={like._id} className='flex items-center gap-2.5'>
                        <img
                          src={
                            getImageURL(like.image, 'miniAvatar') || '/assets/icons/profile-placeholder.svg'
                          }
                          alt='avatar'
                          className='w-8 h-8 rounded-full'
                        />
                        <p className='small-regular'>{like.name}</p>
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
        </div>

        <Link to='/post/$postID' params={{ postID: post._id }} className='flex gap-1.5'>
          <img src='/assets/icons/comment.svg' alt='comment' className='w-5 h-5 cursor-pointer' />
          <p className={cn('small-medium lg:base:medium', textWhite && 'text-white')}>
            {post.comments.length}
          </p>
        </Link>
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
