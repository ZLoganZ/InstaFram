import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Loader from '@/components/Shared/Loader';
import GridPostsList from '@/components/Post/GridPostsList';
import { useGetSavedPostsByUserID } from '@/lib/hooks/query';
import { useAuth } from '@/lib/hooks/useAuth';

const SavedPosts = () => {
  const [savedPostsRef, inSavedPostsView] = useInView({ threshold: 0 });
  const { currentUser } = useAuth();
  const {
    posts: savedPosts,
    isLoadingPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextPosts
  } = useGetSavedPostsByUserID(currentUser._id);

  useEffect(() => {
    if (inSavedPostsView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [inSavedPostsView]);

  return (
    <>
      {isLoadingPosts || !savedPosts ? (
        <Loader />
      ) : savedPosts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={savedPosts} showStats showUser />

          {hasNextPosts && (
            <div ref={savedPostsRef}>
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SavedPosts;
