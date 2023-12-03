import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { GridPostsList, Loader } from '@/components/Shared';
import { useGetLikedPostsByUserID } from '@/lib/hooks/query';
import { useAuth } from '@/lib/hooks/useAuth';

const LikedPosts = () => {
  const [ref, isInView] = useInView({ threshold: 0 });
  const { currentUser } = useAuth();
  const {
    posts: likedPosts,
    isLoadingPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextPosts
  } = useGetLikedPostsByUserID(currentUser._id);

  useEffect(() => {
    if (isInView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInView]);

  return (
    <>
      {isLoadingPosts || !likedPosts ? (
        <Loader />
      ) : likedPosts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={likedPosts} />

          {hasNextPosts && (
            <div ref={ref}>
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LikedPosts;
