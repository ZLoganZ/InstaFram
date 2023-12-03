import { Link, useNavigate } from 'react-router-dom';

import { PostStats } from '@/components/Shared';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn, getDateTimeToNow, getImageURL } from '@/lib/utils';
import { IPost } from '@/types';

interface IPostCard {
  post: IPost;
}

const PostCard: React.FC<IPostCard> = ({ post }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='bg-light-2 dark:bg-dark-2 rounded-3xl border border-light-4 dark:border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm'>
      <div className='flex-between'>
        <Link to={`/profile/${post.creator._id}`}>
          <div className='flex items-center gap-3'>
            <img
              className='w-12 lg:h-12 rounded-full'
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
          </div>
        </Link>
        <Link to={`/posts/${post._id}/edit`} className={cn(currentUser._id !== post.creator._id && 'hidden')}>
          <img src='/assets/icons/edit.svg' alt='edit' className='w-5 h-5' />
        </Link>
      </div>
      <>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post.content}</p>
          <ul className='flex flex-wrap gap-1.5 mt-2'>
            {post.tags.map((tag) => (
              <li
                key={tag}
                className='text-[#7878A3] cursor-pointer hover:underline'
                onClick={() => navigate(`explore?search=${tag}`)}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        {post.image && (
          <Link to={`/posts/${post._id}`} className='flex-center'>
            <img
              src={getImageURL(post.image, 'post')}
              alt='post'
              className='h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5'
            />
          </Link>
        )}
      </>
      <PostStats post={post} userID={currentUser._id} />
    </div>
  );
};

export default PostCard;
