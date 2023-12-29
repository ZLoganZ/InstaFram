import GridPostsList from "@/components/Post/GridPostsList";
import Loader from "@/components/Shared/Loader";
import { IPost } from "@/types";

interface ISearchResults {
  isFetching: boolean;
  searchPosts: IPost[];
}

const SearchPostsResults = ({ isFetching, searchPosts }: ISearchResults) => {
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : searchPosts.length > 0 ? (
        <GridPostsList posts={searchPosts} showStats showUser />
      ) : (
        <p className="mt-10 w-full text-center text-[#5C5C7B]">
          No results found
        </p>
      )}
    </>
  );
};

export default SearchPostsResults;
