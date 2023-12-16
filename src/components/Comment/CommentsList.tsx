import Loader from '@/components/Shared/Loader';
import CommentCard from './CommentCard';
import { IComment } from '@/types';

interface ICommentsListProps {
  isLoadingComments: boolean;
  comments: IComment[];
  commentsCount: number;
  setReplyTo: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CommentsList = ({ comments, isLoadingComments, commentsCount, setReplyTo }: ICommentsListProps) => {
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
          {commentsCount > comments.length && (
            <p className='text-[#5C5C7B] mt-10 text-center w-full'>
              {commentsCount - comments.length} more comments
            </p>
          )}
        </ul>
      )}
    </div>
  );
};

export default CommentsList;
