import bcrypt from 'bcrypt';
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if(isExist){
                //user already exist
                //compare password
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email','password','roleId'],
                    raw: true
                })
                if(user){
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = "Successfully";

                        delete user.password;
                        userData.user = user;
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`;
                }

            }else{
                //return error
                userData.errCode = 1;
                userData.errMessage = "Your's email isn't exist in our system!";
                
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail}
            })
            if(user){
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = '';
            if(userId === "ALL"){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== "ALL"){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
                
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if(check){
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exists'
                })
            }else {
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
            resolve({
                errCode: 0,
                errMessage: "Create user successfully!!!",
            });
            }

            
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

let deleteUser = (id) => {
    return new Promise(async(resolve, reject) => {
        let user = await db.User.findOne({
            where: {id: id},
        });
        if(!user){
            resolve({
                errCode: 2,
                errMessage: "User isn't exist!!!"
            })
        }
        
        await db.User.destroy({
            where: {id: id}
        })

        resolve({
            errCode: 0,
            errMessage: "Delete user successfully!!!"
        })

    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(data);
            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            });
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update user successfully!!!"
                });
            } else{
                resolve({
                    errCode: 1,
                    errMessage: "User not found!!!"
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}