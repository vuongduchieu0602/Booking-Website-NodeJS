import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);

        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

//hiển thị form nhập dữ liệu
let getCRUD = (req, res) => {
    return res.render("crud.ejs");
}

//hiển thị danh sách người dùng
let displayCRUD = async(req, res) => {
    let data = await CRUDService.getAllUser();
    console.log(data);

    // return res.send('Display CRUD');
        
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

//lưu thông tin người dùng
let postCRUD = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("POST CRUD");
}

let getEditCRUD = async(req, res) => {
    let userId = req.query.id;       //lấy id của user
    if(userId){
        let userData = await CRUDService.getUserByInfoId(userId);
        

        return res.render("editCRUD.ejs", {
            userData
        });
    }else{
        res.send("User not found!!!");
    }
    


    return res.send("CRUD form id");
}

let putCRUD = async(req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs',{
        dataTable: allUser
    })
}

let deleteCRUD = async(req, res) => {
    let id = req.query.id;
    if(id){
        await CRUDService.deleteUserById(id);
        return res.send("Delete user successfully");
    }else{
        return res.send("User not found!!!");
    }
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}