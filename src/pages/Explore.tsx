import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { GridPostsList, Loader, SearchResults } from '@/components/Shared';
import { Label } from '@/components/ui/label';
import { useGetTopPosts, useSearchPosts } from '@/lib/hooks/query';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { FILTERS } from '@/lib/constants';

const Explore = () => {
  const [ref, inView] = useInView({ threshold: 0 });
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const [filter, setFilter] = useState(FILTERS.ALL);

  const searchDebounce = useDebounce(searchValue, 500);
  const searchRef = useRef(searchDebounce);

  const { posts, isLoadingPosts, hasNextPosts, fetchNextPosts, isFetchingNextPosts, refetchPosts } =
    useGetTopPosts(filter);
  const { searchPosts, isFetchingSearchPosts, refetchSearchPosts } = useSearchPosts(searchDebounce, filter);

  const shouldShowSearchResults = searchDebounce !== '';
  const shouldShowPopularToday = !shouldShowSearchResults && posts?.length === 0;

  useEffect(() => {
    document.title = 'Explore - InstaFram';
  }, []);

  useEffect(() => {
    if (searchDebounce !== '' && searchDebounce !== searchRef.current) {
      setSearchParams({ search: searchDebounce });
      searchRef.current = searchDebounce;
    } else if (searchDebounce === '') {
      setSearchParams({});
    }
  }, [searchDebounce]);

  useEffect(() => {
    if (inView && hasNextPosts && !shouldShowSearchResults && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [inView]);

  useEffect(() => {
    if (!shouldShowSearchResults) {
      refetchPosts();
    } else {
      refetchSearchPosts();
    }
  }, [filter]);

  return (
    <div className='flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar'>
      <div className='max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex-center gap-1 px-4 w-full rounded-lg bg-light-4 dark:bg-dark-4'>
          <Label htmlFor='search'>
            <img src='/assets/icons/search.svg' alt='search' className='w-6 h-6' />
          </Label>
          <Input
            id='search'
            autoComplete='off'
            placeholder='Search posts'
            className='h-12 bg-light-4 dark:bg-dark-4 border-none placeholder:text-[#5C5C7B] focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='flex-center gap-3 bg-light-3 dark:bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
              <p className='small-medium md:base-medium text-dark-2 dark:text-light-2'>{filter}</p>
              <img src='/assets/icons/filter.svg' alt='filter' className='w-5 h-5' />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='bg-light-3 dark:bg-dark-3' align='end'>
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(FILTERS).map((filterValue) => (
              <DropdownMenuCheckboxItem
                key={filterValue}
                onClick={() => setFilter(filterValue)}
                checked={filter === filterValue}>
                {filterValue}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowSearchResults ? (
          <SearchResults isFetching={isFetchingSearchPosts} searchPosts={searchPosts} />
        ) : shouldShowPopularToday ? (
          <p className='text-[#5C5C7B] mt-10 text-center w-full'>End of posts</p>
        ) : isLoadingPosts ? (
          <Loader />
        ) : (
          <GridPostsList posts={posts} />
        )}
      </div>

      {hasNextPosts && !shouldShowSearchResults && (
        <div ref={ref} className='mt-6'>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
