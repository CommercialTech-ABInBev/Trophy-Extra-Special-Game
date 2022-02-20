import UserRepository from "../repository/userRepository";

export default class UserService {
    constructor(){
        this.repository = new UserRepository();
    }

    init(){
        // this.repository.updateUser("-MwOPfGvyxO3PolxO2RQ", {
        //     ...{can: {count:2, modifiedOn: new Date()}},
        //     ...{daily: {lives:3, modifiedOn: new Date()}},
        // });
        this.repository.getAllUsers(()=>{});
    }
    
    getUsers(){
        this.repository.getAllUsers(function (data){
            console.log("Users: ", data);
        });
    }

    getUserByEmail(email){
        let user = "";
        this.repository.getAllUsers(function (data){
            user = data.find((u) => { return u.emailAddress === email})
        });
        return user;
    }

    getUser(id){
        this.repository.getOneUser(id, function (data){
            console.log("User: ", data);
        });
    }

    createUser(modelData) {
        this.repository.createUser(modelData);
    }
}