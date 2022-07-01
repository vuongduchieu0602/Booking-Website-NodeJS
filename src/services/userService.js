import bcrypt from 'bcrypt';
import db from "../models/index";

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
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser
}