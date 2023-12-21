import GridPostsList from '@/components/Post/GridPostsList';
import Loader from '@/components/Shared/Loader';
import { IPost } from '@/types';

interface ISearchResults {
  isFetching: boolean;
  searchPosts: IPost[];
}

const SearchResults = ({ isFetching, searchPosts }: ISearchResults) => {
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : searchPosts.length > 0 ? (
        <GridPostsList posts={searchPosts} showStats showUser />
      ) : (
        <p className='text-[#5C5C7B] mt-10 text-center w-full'>No results found</p>
      )}
    </>
  );
};

export default SearchResults;
