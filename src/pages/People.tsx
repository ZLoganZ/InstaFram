import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RouteApi, useNavigate } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Shared/Loader";
import GridUsersList from "@/components/User/GridUsersList";
import SearchUsersResults from "@/components/User/SearchUsersResult";
import { useGetTopCreators, useSearchUsers } from "@/lib/hooks/query";
import { useDebounce } from "@/lib/hooks/useDebounce";

const routeApi = new RouteApi({ id: "/main/people" });

const People = () => {
  const { search } = routeApi.useSearch();
  const navigate = useNavigate();
  const [creatorsRef, inCreatorsView] = useInView({ threshold: 0 });
  const [searchRef, inSearchView] = useInView({ threshold: 0 });
  const {
    topCreators,
    isLoadingTopCreators,
    hasNextTopCreators,
    isFetchingNextTopCreators,
    fetchNextTopCreators,
  } = useGetTopCreators();

  const [searchValue, setSearchValue] = useState(search ?? "");

  const searchDebounce = useDebounce(searchValue, 500);
  const searchInputRef = useRef(searchDebounce);

  const showSearchResults = useMemo(
    () => searchDebounce !== "",
    [searchDebounce],
  );

  const {
    searchUsers,
    isLoadingSearchUsers,
    isFetchingNextSearchUsers,
    hasNextSearchUsers,
    fetchNextSearchUsers,
  } = useSearchUsers(searchDebounce);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [],
  );

  useEffect(() => {
    if (searchDebounce !== "" && searchDebounce !== searchInputRef.current) {
      navigate({
        search: (pre) => ({ ...pre, search: searchDebounce }),
        replace: true,
      });
      searchInputRef.current = searchDebounce;
    } else if (searchDebounce === "") {
      navigate({
        search: (pre) => ({ ...pre, search: undefined }),
        replace: true,
      });
    }
  }, [searchDebounce]);

  useEffect(() => {
    document.title = "People - InstaFram";
  }, []);

  useEffect(() => {
    if (inCreatorsView && hasNextTopCreators && !isFetchingNextTopCreators) {
      fetchNextTopCreators();
    }

    if (
      inSearchView &&
      hasNextSearchUsers &&
      !isFetchingNextSearchUsers &&
      showSearchResults
    ) {
      fetchNextSearchUsers();
    }
  }, [inCreatorsView, inSearchView]);

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:px-8 lg:p-14">
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Search Users</h2>
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
            placeholder="Search users"
            className="h-12 border-none bg-light-4 ring-offset-0 placeholder:text-[#5C5C7B] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-dark-4"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <h3 className="body-bold md:h3-bold w-full max-w-5xl">Popular</h3>

      <div className="flex w-full max-w-5xl flex-wrap gap-9">
        {showSearchResults ? (
          <SearchUsersResults
            searchUsers={searchUsers}
            isFetching={isLoadingSearchUsers}
          />
        ) : isLoadingTopCreators || !topCreators ? (
          <Loader />
        ) : (
          <GridUsersList users={topCreators} />
        )}
      </div>

      {hasNextTopCreators && !showSearchResults && (
        <div ref={creatorsRef}>
          <Loader />
        </div>
      )}

      {hasNextSearchUsers && showSearchResults && (
        <div ref={searchRef}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default People;
