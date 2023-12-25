import UserCard from '@/components/User/UserCard';
import { IUser } from '@/types';

interface IGridUsersList {
  users: IUser[];
}

const GridUsersList = ({ users }: IGridUsersList) => {
  return (
    <ul className='w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl'>
      {users.map((user) => (
        <li key={user._id} className='flex-1 min-w-[200px] w-full'>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
};

export default GridUsersList;
