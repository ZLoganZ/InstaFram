import { useEffect } from 'react';

import Loader from '@/components/Shared/Loader';
import UserCard from '@/components/User/UserCard';
import { useGetTopCreators } from '@/lib/hooks/query';
import { useInView } from 'react-intersection-observer';

const People = () => {
  const [creatorsRef, isInCreatorsView] = useInView({ threshold: 0 });
  const {
    topCreators,
    isLoadingTopCreators,
    hasNextTopCreators,
    isFetchingNextTopCreators,
    fetchNextTopCreators
  } = useGetTopCreators();

  useEffect(() => {
    document.title = 'People - InstaFram';
  }, []);

  useEffect(() => {
    if (isInCreatorsView && hasNextTopCreators && !isFetchingNextTopCreators) {
      fetchNextTopCreators();
    }
  }, [isInCreatorsView]);

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
      <div className='max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>Popular Users</h2>
        {isLoadingTopCreators || !topCreators ? (
          <Loader />
        ) : (
          <ul className='w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl'>
            {topCreators.map((user) => (
              <li key={user._id} className='flex-1 min-w-[200px] w-full'>
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
    </div>
  );
};

export default People;
