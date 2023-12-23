import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import StatNumber from '@/components/Post/StatNumber';
import { useLikePost, useSavePost } from '@/lib/hooks/mutation';
import { cn } from '@/lib/utils';
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
  }, [post._id, isPostPage, navigate]);

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
          <StatNumber dataList={post.likes} dataCount={likes.length} type='like' textWhite={textWhite} />
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
