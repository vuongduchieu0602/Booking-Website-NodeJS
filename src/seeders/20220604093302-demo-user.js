'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email:'vg.duchieu0602@gmail.com',
      password: '123456',
      firstName: 'Vương',
      lastName: 'Hiếu',
      address: '129 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
      phoneNumber:"0368701680",
      gender: 1,
      image: '',
      roleId: "R1",
      positionId: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
