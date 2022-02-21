import UserRepository from "../repository/userRepository";

export default class UserService {
    constructor(){
        this.repository = new UserRepository();
    }

    init(){
        this.repository.getAllUsers((x)=>{});
    }
    
    getUsers(){
        this.repository.getAllUsers((x) => {});
    }

    getUserByEmail(email){
        let user = {};
        this.repository.getAllUsers(function (data){
            user = data.find((u) => { return u.emailAddress === email})
        });
        return user;
    }

    getUser(id){
        this.repository.getOneUser(id, (x) => {});
    }

    createUser(modelData) {
        modelData = {
            daily: {lives:3, modifiedOn: this.formatDate()},
            can: {count:0, modifiedOn: this.formatDate()},
            createdOn: this.formatDate(),
            ...modelData
        }
        this.repository.createUser(modelData);
    }

    updateUser(path, modelData) {
        let user = {};
        this.repository.updateUser(path, modelData, (x) => {
            user = x;
        });
        return user
    }

    formatDate(d = new Date()){
        return (
            [
                d.getDate().toString().padStart(2,"0"),
                (d.getMonth()+1).toString().padStart(2,"0"),
                d.getFullYear().toString().padStart(4,"0")
            ].join('-') +' ' +
            [
                d.getHours().toString().padStart(2,"0"),
                d.getMinutes().toString().padStart(2,"0"),
                d.getSeconds().toString().padStart(2,"0")
            ].join(':')
        );
    }
}