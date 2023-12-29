import UserCard from "@/components/User/UserCard";
import { IUser } from "@/types";

interface IGridUsersList {
  users: IUser[];
}

const GridUsersList = ({ users }: IGridUsersList) => {
  return (
    <ul className="grid w-full max-w-5xl grid-cols-1 gap-7 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <li key={user._id} className="w-full min-w-[200px] flex-1">
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
};

export default GridUsersList;
