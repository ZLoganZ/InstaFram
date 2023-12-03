import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGetSavedPostsByUserID } from '@/lib/hooks/query';
import { Loader, GridPostsList } from '@/components/Shared';
import { useAuth } from '@/lib/hooks/useAuth';

const SavedPosts = () => {
  const [ref, isInView] = useInView({ threshold: 0 });
  const { currentUser } = useAuth();
  const {
    posts: savedPosts,
    isLoadingPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextPosts
  } = useGetSavedPostsByUserID(currentUser._id);

  useEffect(() => {
    if (isInView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInView]);

  return (
    <>
      {isLoadingPosts || !savedPosts ? (
        <Loader />
      ) : savedPosts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={savedPosts} />

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

export default SavedPosts;
