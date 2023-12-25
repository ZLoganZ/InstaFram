import Loader from '@/components/Shared/Loader';
import GridUsersList from '@/components/User/GridUsersList';
import { IUser } from '@/types';

interface ISearchResults {
  isFetching: boolean;
  searchUsers: IUser[];
}

const SearchUsersResults = ({ isFetching, searchUsers }: ISearchResults) => {
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : searchUsers.length > 0 ? (
        <GridUsersList users={searchUsers} />
      ) : (
        <p className='text-[#5C5C7B] mt-10 text-center w-full'>No results found</p>
      )}
    </>
  );
};

export default SearchUsersResults;
