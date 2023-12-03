import { useEffect } from 'react';

import { Loader, UserCard } from '@/components/Shared';
import { useGetTopCreators } from '@/lib/hooks/query';

const People = () => {
  const { topCreators, isLoadingTopCreators } = useGetTopCreators();

  useEffect(() => {
    document.title = 'People - InstaFram';
  }, []);

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
      <div className='max-w-5xl flex flex-col items-start w-full gap-6 md:gap-9'>
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
      </div>
    </div>
  );
};

export default People;
