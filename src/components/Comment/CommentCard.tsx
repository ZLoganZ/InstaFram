import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { useAuth } from '@/lib/hooks/useAuth';
import { useLikeComment } from '@/lib/hooks/mutation';
import { cn, getDateTimeToNow, getImageURL } from '@/lib/utils';
import { IComment, IReplyTo } from '@/types';
import { useGetRepliesByCommentID } from '@/lib/hooks/query';
import Loader from '../Shared/Loader';

interface ICommentProps {
  comment: IComment;
  replyTo: IReplyTo | undefined;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
  parentID?: string;
}

const CommentCard = ({ comment, replyTo, setReplyTo }: ICommentProps) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(comment.likes.map((like) => like._id));

  const checkIsLiked = useMemo(() => {
    return likes.includes(currentUser._id);
  }, [likes, currentUser._id]);

  const { replies, isLoadingReplies, fetchNextReplies, isFetchingNextReplies, hasNextReplies } =
    useGetRepliesByCommentID(comment._id);
  const { likeComment, isLoadingLikeComment } = useLikeComment();

  const remainingReplies = comment.replies.length - replies?.length;

  const handleLikeComment = async () => {
    const hasLiked = likes.includes(currentUser._id);

    if (hasLiked) {
      setLikes(likes.filter((like) => like !== currentUser._id));
    } else {
      setLikes([...likes, currentUser._id]);
    }

    await likeComment(comment._id);
  };

  return (
    <article className='flex w-full flex-col'>
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              className='size-11'
              to='/$profileID'
              params={{ profileID: comment.user.alias || comment.user._id }}>
              <img
                className='cursor-pointer rounded-full'
                src={getImageURL(comment.user.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                alt='user_community_image'
              />
            </Link>

            {/* <div className='mt-2 w-0.5 grow rounded-full bg-dark-3/50 dark:bg-light-3/50' /> */}
          </div>

          <div className='flex w-full flex-col'>
            <div className='flex gap-2 items-baseline'>
              <Link
                className='w-fit hover:underline line-clamp-1'
                to='/$profileID'
                params={{ profileID: comment.user.alias || comment.user._id }}>
                <h4 className='cursor-pointer base-semibold text-dark-1 dark:text-light-1'>
                  {comment.user.name}
                </h4>
              </Link>

              <p className='subtle-medium'>{getDateTimeToNow(comment.createdAt)}</p>
            </div>

            <div className='flex flex-row justify-between'>
              <p className='mt-2 small-regular text-dark-2 dark:text-light-2'>{comment.content}</p>
              <div className='flex-center flex-col gap-0.5 '>
                <img
                  className={cn(
                    'cursor-pointer object-contain size-4 md:size-5 hover:scale-110',
                    isLoadingLikeComment && 'animate-pulse'
                  )}
                  src={checkIsLiked ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
                  alt='like'
                  onClick={handleLikeComment}
                />
                <p className='subtle-semibold lg:small:medium'>{comment.likes.length}</p>
              </div>
            </div>

            <div className='mb-2 flex flex-col gap-2'>
              <div className='flex-center w-fit gap-2'>
                {!comment.isChild && (
                  <img
                    className={cn(
                      'cursor-pointer object-contain size-4 md:size-5 hover:scale-110',
                      replyTo && replyTo.to === comment._id && 'drop-shadow-2xl'
                    )}
                    src='/assets/icons/reply.svg'
                    alt='reply'
                    onClick={() => setReplyTo({ to: comment._id, user: comment.user })}
                  />
                )}
                <img
                  className='cursor-pointer object-contain size-4 md:size-5 hover:scale-110'
                  src='/assets/icons/send.svg'
                  alt='send'
                />
              </div>

              {!comment.isChild && comment.replies.length !== 0 && (
                <>
                  <div className='flex flex-col gap-2 w-full max-w-5xl'>
                    {isLoadingReplies ? (
                      <div className='flex-center gap-2'>
                        <Loader />
                        Loading...
                      </div>
                    ) : replies.length === 0 ? (
                      <p className='text-[#5C5C7B] mt-10 text-center w-full'>No replies yet</p>
                    ) : (
                      <ul className='flex flex-col gap-5 bg-light-2 dark:bg-dark-2 rounded-2xl pt-5'>
                        {replies.map((reply) => (
                          <li key={reply._id}>
                            <CommentCard comment={reply} replyTo={replyTo} setReplyTo={setReplyTo} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {hasNextReplies && remainingReplies > 0 && (
                    <div className='flex gap-1 w-fit cursor-pointer group' onClick={() => fetchNextReplies()}>
                      {isFetchingNextReplies ? (
                        <div className='flex-center gap-2 subtle-medium'>
                          <Loader />
                          Loading...
                        </div>
                      ) : (
                        <>
                          <p className='subtle-medium group-hover:underline line-clamp-1'>
                            {remainingReplies} repl{remainingReplies > 1 ? 'ies' : 'y'}
                          </p>
                          <img src='/assets/icons/reply.svg' alt='reply' className='object-contain size-4' />
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
