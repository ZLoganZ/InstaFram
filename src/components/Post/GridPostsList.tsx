import { Link } from '@tanstack/react-router';

import PostStats from '@/components/Post/PostStats';
import { getImageURL } from '@/lib/utils';
import { IPost } from '@/types';

interface IGridPostsList {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostsList = ({ posts, showStats = false, showUser = false }: IGridPostsList) => {
  return (
    <ul className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl'>
      {posts.map((post) => (
        <li key={post._id} className='relative min-w-[18rem] h-72'>
          <Link
            className='flex rounded-[24px] border border-light-4 dark:border-dark-4 overflow-hidden cursor-pointer w-full h-full'
            to='/post/$postID'
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
            {showStats && <PostStats post={post} textWhite />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostsList;
