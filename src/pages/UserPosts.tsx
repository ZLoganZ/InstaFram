import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useParams } from 'react-router-dom';

import { Loader, GridPostsList } from '@/components/Shared';
import { useGetPostsByUserID } from '@/lib/hooks/query';

const UserPosts = () => {
  const [ref, isInView] = useInView({ threshold: 0 });
  const { id } = useParams();
  const { pathname } = useLocation();
  const { posts, hasNextPosts, isFetchingNextPosts, isLoadingPosts, fetchNextPosts } = useGetPostsByUserID(
    id ?? ''
  );

  useEffect(() => {
    if (isInView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [isInView]);

  return (
    <>
      {isLoadingPosts || !posts ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className='text-[#5C5C7B]'>No available posts</p>
      ) : (
        <>
          <GridPostsList posts={posts} showUser={false} />

          {hasNextPosts && pathname === `/profile/${id}` && (
            <div ref={ref}>
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPosts;
