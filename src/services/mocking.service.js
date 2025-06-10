
import bcrypt from 'bcrypt';

export function generateMockUsers(count = 1) {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      _id: `mockedid${i}`,
      first_name: `Nombre${i}`,
      last_name: `Apellido${i}`,
      email: `user${i}@mock.com`,
      password: '$2b$10$mockedHashedPassword', 
      role: Math.random() > 0.5 ? 'admin' : 'user',
      pets: [],
    });
  }

  return users;
}
