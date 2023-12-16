import { Link } from '@tanstack/react-router';

import { getDateTimeToNow, getImageURL } from '@/lib/utils';
import { IComment } from '@/types';

interface ICommentProps {
  comment: IComment;
  setReplyTo: React.Dispatch<React.SetStateAction<string | undefined>>;
  parentID?: string;
}

const CommentCard = ({ comment }: ICommentProps) => {
  return (
    <article className='flex w-full flex-col'>
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              className='h-11 w-11'
              to='/profile/$profileID'
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
            <div className='flex gap-2'>
              <Link
                className='w-fit hover:underline'
                to='/profile/$profileID'
                params={{ profileID: comment.user.alias || comment.user._id }}>
                <h4 className='cursor-pointer base-semibold text-dark-1 dark:text-light-1'>
                  {comment.user.name}
                </h4>
              </Link>

              <p className='mt-1 subtle-medium'>{getDateTimeToNow(comment.createdAt)}</p>
            </div>

            <div className='flex flex-row justify-between'>
              <p className='mt-2 small-regular text-dark-2 dark:text-light-2'>{comment.content}</p>
              <div className='flex-center flex-col gap-0.5 '>
                <img
                  className='cursor-pointer object-contain h-4 w-4 md:h-5 md:w-5 hover:scale-110'
                  src='/assets/icons/like.svg'
                  alt='like'
                />
                <p className='subtle-semibold lg:small:medium'>{comment.likes.length}</p>
              </div>
            </div>

            <div className='mb-2 flex flex-col gap-2'>
              <div className='flex-center w-fit gap-2'>
                <img
                  className='cursor-pointer object-contain h-4 w-4 md:h-5 md:w-5'
                  src='/assets/icons/reply.svg'
                  alt='reply'
                />
                <img
                  className='cursor-pointer object-contain h-4 w-4 md:h-5 md:w-5'
                  src='/assets/icons/send.svg'
                  alt='send'
                />
              </div>

              {comment.replies.length > 0 && (
                <div className='flex gap-1 w-fit cursor-pointer group'>
                  <p className='subtle-medium group-hover:underline'>
                    {comment.replies.length} repl{comment.replies.length > 1 ? 'ies' : 'y'}
                  </p>
                  <img src='/assets/icons/reply.svg' alt='reply' className='object-contain h-4 w-4' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
