import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Loader from '@/components/Shared/Loader';
import GridPostsList from '@/components/Post/GridPostsList';
import { useGetLikedPostsByUserID } from '@/lib/hooks/query';
import { useAuth } from '@/lib/hooks/useAuth';

const LikedPosts = () => {
  const [likedPostsRef, isInLikedPostsView] = useInView({ threshold: 0 });
  const { currentUser } = useAuth();
  const {
    posts: likedPosts,
    isLoadingPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextPosts
  } = useGetLikedPostsByUserID(currentUser._id);

  useEffect(() => {
    if (isInLikedPostsView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInLikedPostsView]);

  return (
    <>
      {isLoadingPosts || !likedPosts ? (
        <Loader />
      ) : likedPosts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={likedPosts} showStats showUser />

          {hasNextPosts && (
            <div ref={likedPostsRef}>
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LikedPosts;
