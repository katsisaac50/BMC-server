const bcrypt = require('bcryptjs');
const { ROLES } = require('../config');

let users = [
  {
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: ROLES.ADMIN,
    role2: { type: String, enum: ['user', 'admin'], default: 'user' }
    name: 'Admin User',
    email: 'admin@hospital.com',
    isActive: true
  }
];

module.exports = {
  findById: (id) => users.find(u => u.id === id),
  findByUsername: (username) => users.find(u => u.username === username),
  comparePassword: (password, hash) => bcrypt.compareSync(password, hash),
  getAll: () => users.map(u => ({ ...u, password: undefined })),
  create: (user) => {
    const newUser = { 
      id: Date.now().toString(),
      password: bcrypt.hashSync(user.password, 10),
      ...user 
    };
    users.push(newUser);
    return { ...newUser, password: undefined };
  }
};
