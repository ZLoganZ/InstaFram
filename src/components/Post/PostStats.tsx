import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLikePost, useSavePost } from '@/lib/hooks/mutation';
import { cn, getImageURL } from '@/lib/utils';
import { IPost } from '@/types';
import { Link } from '@tanstack/react-router';

interface IPostStats {
  post: IPost;
  userID: string;
  textWhite?: boolean;
}

const PostStats: React.FC<IPostStats> = ({ post, userID, textWhite = false }) => {
  const likesList = post.likes.map((like) => like._id);

  const { likePost } = useLikePost();
  const { savePost } = useSavePost();

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(post.saves.some((save) => save.user._id === userID));

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    const hasLiked = likes.includes(userID);

    if (hasLiked) {
      setLikes(likes.filter((like) => like !== userID));
    } else {
      setLikes([...likes, userID]);
    }

    likePost(post._id);
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsSaved(!isSaved);

    savePost(post._id);
  };

  const checkIsLiked = (likesList: string[], userID: string) => {
    return likesList.includes(userID);
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-2 mr-2'>
        <div className='flex gap-1.5'>
          <img
            className='w-5 h-5 cursor-pointer hover:scale-110'
            src={checkIsLiked(likes, userID) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
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

        <Link to='/posts/$postID' params={{ postID: post._id }} className='flex gap-1.5'>
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
