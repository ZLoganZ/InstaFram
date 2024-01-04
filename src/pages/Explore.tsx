import { useNavigate, RouteApi } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import SearchPostsResults from "@/components/Post/SearchPostsResults";
import Loader from "@/components/Shared/Loader";
import GridPostsList from "@/components/Post/GridPostsList";
import { useGetTopPosts, useSearchPosts } from "@/lib/hooks/query";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FILTERS } from "@/lib/constants";

const routeApi = new RouteApi({ id: "/main/explore" });

const Explore = () => {
  const [postsRef, inPostsView] = useInView({ threshold: 0 });
  const [searchRef, inSearchView] = useInView({ threshold: 0 });
  const { filter, search } = routeApi.useSearch();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState(search ?? "");

  const searchDebounce = useDebounce(searchValue, 500);
  const searchInputRef = useRef(searchDebounce);

  const {
    posts,
    isLoadingPosts,
    hasNextPosts,
    fetchNextPosts,
    isFetchingNextPosts,
  } = useGetTopPosts(filter);

  const {
    searchPosts,
    isLoadingSearchPosts,
    hasNextSearchPosts,
    fetchNextSearchPosts,
    isFetchingNextSearchPosts,
  } = useSearchPosts(searchDebounce, filter);

  const showSearchResults = useMemo(
    () => searchDebounce !== "",
    [searchDebounce],
  );

  useEffect(() => {
    document.title = "Explore - InstaFram";
  }, []);

  useEffect(() => {
    if (searchDebounce !== "" && searchDebounce !== searchInputRef.current) {
      navigate({
        search: (pre) => ({ ...pre, search: searchDebounce }),
        replace: true,
        params: {},
      });
      searchInputRef.current = searchDebounce;
    } else if (searchDebounce === "") {
      navigate({
        search: (pre) => ({ ...pre, search: undefined }),
        replace: true,
        params: {},
      });
    }
  }, [searchDebounce]);

  useEffect(() => {
    if (
      inPostsView &&
      hasNextPosts &&
      !showSearchResults &&
      !isFetchingNextPosts
    ) {
      fetchNextPosts();
    }
  }, [inPostsView]);

  useEffect(() => {
    if (
      inSearchView &&
      hasNextSearchPosts &&
      showSearchResults &&
      !isFetchingNextSearchPosts
    ) {
      fetchNextSearchPosts();
    }
  }, [inSearchView]);

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:p-14">
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex-center w-full gap-1 rounded-lg bg-light-4 px-4 dark:bg-dark-4">
          <Label htmlFor="search">
            <img
              src="/assets/icons/search.svg"
              alt="search"
              className="size-6"
            />
          </Label>
          <Input
            id="search"
            autoComplete="off"
            placeholder="Search posts"
            className="h-12 border-none bg-light-4 ring-offset-0 placeholder:text-[#5C5C7B] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-dark-4"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl">
        <h3 className="body-bold md:h3-bold">Popular</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex-center cursor-pointer gap-3 rounded-xl bg-light-3 px-4 py-2 dark:bg-dark-3">
              <p className="small-medium md:base-medium text-dark-2 dark:text-light-2">
                {filter}
              </p>
              <img
                src="/assets/icons/filter.svg"
                alt="filter"
                className="size-5"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-light-3 dark:bg-dark-3"
            align="end"
          >
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(FILTERS).map((filterValue) => (
              <DropdownMenuCheckboxItem
                key={filterValue}
                onClick={() =>
                  navigate({
                    search: (pre) => ({ ...pre, filter: filterValue }),
                    params: {},
                  })
                }
                checked={filter === filterValue}
              >
                {filterValue}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex w-full max-w-5xl flex-wrap gap-9">
        {showSearchResults ? (
          <SearchPostsResults
            isFetching={isLoadingSearchPosts}
            searchPosts={searchPosts}
          />
        ) : isLoadingPosts || !posts ? (
          <Loader />
        ) : (
          <GridPostsList posts={posts} showStats showUser />
        )}
        {/* {showEndPost && <p className='text-[#5C5C7B] mt-10 text-center w-full'>End of posts</p>} */}
      </div>

      {hasNextPosts && !showSearchResults && (
        <div ref={postsRef}>
          <Loader />
        </div>
      )}

      {hasNextSearchPosts && showSearchResults && (
        <div ref={searchRef}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
