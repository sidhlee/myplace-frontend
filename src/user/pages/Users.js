import React from 'react';
import UsersList from '../components/UsersList';

const USERS = [
  {
    id: 'u1',
    name: 'Jacky',
    image: 'https://placem.at/people?w=1260&h=750',
    places: 3,
  },
];

const Users = () => {
  return <UsersList items={USERS} />;
};

export default Users;
