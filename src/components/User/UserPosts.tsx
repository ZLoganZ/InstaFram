import { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { useInView } from 'react-intersection-observer';

import Loader from '@/components/Shared/Loader';
import GridPostsList from '@/components/Post/GridPostsList';
import { useGetPostsByUserID } from '@/lib/hooks/query';
import { ProfileRoute } from '@/routes/private.routes';

const UserPosts = (): JSX.Element => {
  const [postsRef, isInPostsView] = useInView({ threshold: 0 });
  const { profileID } = useParams({ from: ProfileRoute.id });
  const { pathname } = window.location;
  const { posts, hasNextPosts, isFetchingNextPosts, isLoadingPosts, fetchNextPosts } =
    useGetPostsByUserID(profileID);

  useEffect(() => {
    if (isInPostsView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInPostsView]);

  return (
    <>
      {isLoadingPosts || !posts ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={posts} showStats />

          {hasNextPosts && pathname === `/profile/${profileID}` && (
            <div ref={postsRef}>
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPosts;
