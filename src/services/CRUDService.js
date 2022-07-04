import bcrypt from 'bcrypt';
import db from '../models';
const salt = bcrypt.genSaltSync(10);

//tạo mới người dùng
let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });
            resolve('Create a new user successfully!!!');
        } catch (error) {
            reject(error);
        }
    })    
}

//mã hóa password
let hashUserPassword = (password) => {
    return new Promise( async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = () => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserByInfoId = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({ 
                where: { id: userId },
                raw: true
            })
            if(user){
                resolve(user);
            }else{
                resolve({});
            }
        } catch (error) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            });
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
            }else{
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUserById = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            });
            if(user){
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserByInfoId: getUserByInfoId,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}