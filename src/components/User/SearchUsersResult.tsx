import Loader from "@/components/Shared/Loader";
import GridUsersList from "@/components/User/GridUsersList";
import { IUser } from "@/types";

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
        <p className="mt-10 w-full text-center text-[#5C5C7B]">
          No results found
        </p>
      )}
    </>
  );
};

export default SearchUsersResults;
