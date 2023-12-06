import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/ui/button';
import Loader from '@/components/Shared/Loader';
import UserCard from '@/components/User/UserCard';
import PostCard from '@/components/Post/PostCard';
import { useGetTopCreators, useGetPosts } from '@/lib/hooks/query';

const Home = () => {
  const [postsRef, isInPostsView] = useInView({ threshold: 0 });
  const [creatorsRef, isInCreatorsView] = useInView({ threshold: 0 });
  const { isLoadingPosts, posts, hasNextPosts, isFetchingNextPosts, fetchNextPosts } = useGetPosts();
  const {
    topCreators,
    isLoadingTopCreators,
    hasNextTopCreators,
    isFetchingNextTopCreators,
    fetchNextTopCreators
  } = useGetTopCreators();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInPostsView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInPostsView]);

  useEffect(() => {
    if (isInCreatorsView && hasNextTopCreators && !isFetchingNextTopCreators) {
      fetchNextTopCreators();
    }
  }, [isInCreatorsView]);

  useEffect(() => {
    document.title = 'InstaFram';
  }, []);

  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
        <div className='max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
          {isLoadingPosts ? (
            <Loader />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts.map((post) => (
                <li key={post._id} className='flex justify-center w-full'>
                  <PostCard key={post._id} post={post} />
                </li>
              ))}
            </ul>
          )}
          {hasNextPosts && (
            <div ref={postsRef}>
              <Loader />
            </div>
          )}
        </div>
      </div>

      <div className='hidden xl:flex flex-col w-72 2xl:w-[465px] px-6 py-10 gap-10 overflow-scroll custom-scrollbar'>
        <h3 className='h3-bold'>Top Creators</h3>
        {isLoadingTopCreators ? (
          <Loader />
        ) : (
          <ul className='grid 2xl:grid-cols-2 gap-6'>
            {topCreators.map((user) => (
              <li key={user._id}>
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
        {hasNextTopCreators && (
          <div ref={creatorsRef}>
            <Loader />
          </div>
        )}
      </div>

      <Button
        onClick={() => navigate({ to: '/posts/create' })}
        className='hidden md:flex fixed h-12 w-12 p-3 rounded-full right-16 bottom-16 2xl:right-[32rem] xl:right-72'>
        <img src='/assets/icons/add-post.svg' alt='create post' className='w-9 h-9 invert-white' />
      </Button>
    </div>
  );
};

export default Home;
