import bcrypt from 'bcrypt';

const users = [
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('12341234', 10),
    isAdmin: true,
  },
  {
    name: 'user1',
    email: 'user1@gmail.com',
    password: bcrypt.hashSync('12341234', 10),
  },
  {
    name: 'user2',
    email: 'user2@gmail.com',
    password: bcrypt.hashSync('12341234', 10),
  },
];

export default users;
