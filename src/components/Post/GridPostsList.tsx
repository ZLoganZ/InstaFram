import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { getImageURL } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { IPost } from '@/types';
import PostStats from './PostStats';

interface IGridPostsList {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostsList: React.FC<IGridPostsList> = ({ posts, showStats = false, showUser = false }) => {
  const { currentUser } = useAuth();

  const listRef = useRef<HTMLDivElement | null>(null);

  /* const virtualizer = */ useWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 320,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0
  });

  return (
    <ul className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 min-[1380px]:grid-cols-3 gap-7 max-w-5xl'>
      {posts.map((post) => (
        <li key={post._id} className='relative min-w-[20rem] h-80'>
          <Link
            className='flex rounded-[24px] border border-light-4 dark:border-dark-4 overflow-hidden cursor-pointer w-full h-full'
            to='/posts/$postID'
            params={{ postID: post._id }}>
            <img src={getImageURL(post.image, 'post')} alt='image' className='h-full w-full object-cover' />
          </Link>
          <div className='absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 rounded-b-[24px] to-transparent gap-2'>
            {showUser && (
              <Link
                className='flex items-center justify-start gap-2 flex-1'
                to='/profile/$profileID'
                params={{ profileID: post.creator.alias || post.creator._id }}>
                <img
                  src={getImageURL(post.creator.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                  alt='avatar'
                  className='w-8 h-8 rounded-full'
                />
                <p className='line-clamp-1 text-white hover:underline'>{post.creator.name}</p>
              </Link>
            )}
            {showStats && <PostStats post={post} userID={currentUser._id} textWhite />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostsList;
