import { useMemo } from 'react';

import Loader from '@/components/Shared/Loader';
import { Button } from '@/components/ui/button';
import CommentCard from './CommentCard';
import { useGetCommentsByPostID } from '@/lib/hooks/query';
import { IReplyTo } from '@/types';

interface ICommentsListProps {
  postID: string;
  commentsCount: number;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
}

const CommentsList = ({ postID, commentsCount, setReplyTo }: ICommentsListProps) => {
  const { comments, isLoadingComments, isFetchingNextComments, fetchNextComments } =
    useGetCommentsByPostID(postID);

  const totalDisplayedComments = useMemo(() => {
    if (comments) return comments.length + comments.reduce((sum, comment) => sum + comment.replies.length, 0);
    return 0;
  }, [comments]);

  return (
    <div className='w-full max-w-5xl'>
      <h3 className='body-bold md:h3-bold w-full my-10'>Comments</h3>
      {isLoadingComments || !comments ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className='text-[#5C5C7B] mt-10 text-center w-full'>No comments yet</p>
      ) : (
        <ul className='flex flex-col gap-5 bg-light-2 dark:bg-dark-2 rounded-2xl p-5'>
          {comments.map((comment) => (
            <li key={comment._id}>
              <CommentCard comment={comment} setReplyTo={setReplyTo} />
            </li>
          ))}
          {commentsCount > totalDisplayedComments && (
            <Button
              type='button'
              variant='link'
              className='text-[#5C5C7B] mt-2 w-full'
              disabled={isFetchingNextComments}
              onClick={() => fetchNextComments()}>
              {isFetchingNextComments ? (
                <div className='flex-center gap-2'>
                  <Loader /> Loading...
                </div>
              ) : (
                <>
                  View {commentsCount - totalDisplayedComments}
                  &nbsp;more comment{commentsCount - totalDisplayedComments > 1 && 's'}
                </>
              )}
            </Button>
          )}
        </ul>
      )}
    </div>
  );
};

export default CommentsList;
