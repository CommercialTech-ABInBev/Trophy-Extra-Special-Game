import UserRepository from "../repository/userRepository";

export default class UserService {
    constructor(){
        this.repository = new UserRepository();
    }
    
    getUsers(){
        this.repository.getAllUsers(function (data){
            console.log("Users: ", data);
        });
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