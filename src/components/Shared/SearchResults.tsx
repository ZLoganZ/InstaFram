import { IPost } from '@/types';
import { Loader } from '@/components/Shared';
import GridPostsList from './GridPostsList';

interface ISearchResults {
  isFetching: boolean;
  searchPosts: IPost[];
}

const SearchResults: React.FC<ISearchResults> = ({ isFetching, searchPosts }) => {
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : searchPosts.length > 0 ? (
        <GridPostsList posts={searchPosts} />
      ) : (
        <p className='text-[#5C5C7B] mt-10 text-center w-full'>No results found</p>
      )}
    </>
  );
};

export default SearchResults;
