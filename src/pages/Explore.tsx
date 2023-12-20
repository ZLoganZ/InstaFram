import { useNavigate, RouteApi } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import SearchResults from '@/components/Post/SearchResults';
import Loader from '@/components/Shared/Loader';
import GridPostsList from '@/components/Post/GridPostsList';
import { useGetTopPosts, useSearchPosts } from '@/lib/hooks/query';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { FILTERS } from '@/lib/constants';

const routeApi = new RouteApi({ id: '/main/explore' });

const Explore = () => {
  const [ref, inView] = useInView({ threshold: 0 });
  const [searchRef, inSearchView] = useInView({ threshold: 0 });
  const { filter, search } = routeApi.useSearch();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState(search ?? '');

  const searchDebounce = useDebounce(searchValue, 500);
  const searchInputRef = useRef(searchDebounce);

  const { posts, isLoadingPosts, hasNextPosts, fetchNextPosts, isFetchingNextPosts } = useGetTopPosts(filter);

  const {
    searchPosts,
    isLoadingSearchPosts,
    hasNextSearchPosts,
    fetchNextSearchPosts,
    isFetchingNextSearchPosts
  } = useSearchPosts(searchDebounce, filter);

  const showSearchResults = useMemo(() => searchDebounce !== '', [searchDebounce]);
  const showEndPost = useMemo(() => !showSearchResults && !hasNextPosts, [hasNextPosts, showSearchResults]);

  useEffect(() => {
    document.title = 'Explore - InstaFram';
  }, []);

  useEffect(() => {
    if (searchDebounce !== '' && searchDebounce !== searchInputRef.current) {
      navigate({ search: (pre) => ({ ...pre, search: searchDebounce }), replace: true });
      searchInputRef.current = searchDebounce;
    } else if (searchDebounce === '') {
      navigate({ search: (pre) => ({ ...pre, search: undefined }), replace: true });
    }
  }, [searchDebounce]);

  useEffect(() => {
    if (inView && hasNextPosts && !showSearchResults && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [inView]);

  useEffect(() => {
    if (inSearchView && hasNextSearchPosts && showSearchResults && !isFetchingNextSearchPosts) {
      fetchNextSearchPosts();
    }
  }, [inSearchView]);

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
          <DropdownMenuTrigger asChild>
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
                onClick={() => navigate({ search: (pre) => ({ ...pre, filter: filterValue }) })}
                checked={filter === filterValue}>
                {filterValue}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {showSearchResults ? (
          <SearchResults isFetching={isLoadingSearchPosts} searchPosts={searchPosts} />
        ) : showEndPost ? (
          <p className='text-[#5C5C7B] mt-10 text-center w-full'>End of posts</p>
        ) : isLoadingPosts ? (
          <Loader />
        ) : (
          <GridPostsList posts={posts} showStats showUser />
        )}
      </div>

      {hasNextPosts && !showSearchResults && (
        <div ref={ref} className='mt-6'>
          <Loader />
        </div>
      )}

      {hasNextSearchPosts && showSearchResults && (
        <div ref={searchRef} className='mt-6'>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
