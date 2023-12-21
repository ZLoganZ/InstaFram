import { Link, useNavigate } from '@tanstack/react-router';

import PostStats from '@/components/Post/PostStats';
import HoverUser from '@/components/Post/HoverUser';
import PostVisibility from '@/components/Post/PostVisibility';
import { FILTERS } from '@/lib/constants';
import { getDateTimeToNow, getImageURL } from '@/lib/utils';
import { IPost } from '@/types';

interface IPostCard {
  post: IPost;
}

const PostCard = ({ post }: IPostCard) => {
  const navigate = useNavigate();

  return (
    <div className='bg-light-2 dark:bg-dark-2 rounded-3xl border border-light-4 dark:border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to='/profile/$profileID' params={{ profileID: post.creator.alias || post.creator._id }}>
            <img
              className='w-12 lg:h-12 rounded-full'
              src={getImageURL(post.creator.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
              alt='avatar'
            />
          </Link>
          <div className='flex flex-col'>
            <HoverUser userID={post.creator._id}>
              <Link to='/profile/$profileID' params={{ profileID: post.creator.alias || post.creator._id }}>
                <p className='base-medium lg:body-bold hover:underline'>{post.creator.name}</p>
              </Link>
            </HoverUser>
            <Link
              to='/profile/$profileID'
              params={{ profileID: post.creator.alias || post.creator._id }}
              className='flex-center gap-1 text-[#7878A3]'>
              <PostVisibility visibility={post.visibility} />-
              <p className='subtle-semibold lg:small-regular hover:underline'>
                {getDateTimeToNow(post.createdAt)}
              </p>
              -<p className='subtle-semibold lg:small-regular hover:underline'>{post.location}</p>
            </Link>
          </div>
        </div>
      </div>
      <>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post.content}</p>
          <ul className='flex flex-wrap gap-1.5 mt-2'>
            {post.tags.map((tag) => (
              <li
                key={tag}
                className='text-[#7878A3] cursor-pointer hover:underline'
                onClick={() =>
                  navigate({
                    to: '/explore',
                    search: (pre) => ({ ...pre, search: tag, filter: FILTERS.ALL })
                  })
                }>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        {post.image && (
          <Link to='/post/$postID' params={{ postID: post._id }} className='flex-center'>
            <img
              src={getImageURL(post.image, 'post')}
              alt='post'
              className='h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5'
            />
          </Link>
        )}
      </>
      <PostStats post={post} />
    </div>
  );
};

export default PostCard;
