import UserService from '/src/firebase/service/userService';

export default class AppController{
    constructor(){
        this.userService = new UserService();
        this.user = {};
    }

    register(model){
        if(this.userService.getUserByEmail(model.emailAddress)){
            return false;
        } else {
            this.userService.createUser(model);
            return true;    
        }
    }

    login(email){
        return this.userService.getUserByEmail(email);
    }

    verify(otpCode){
        return this.userService.getUserByEmail(otpCode);
    }
    
    sendOTP(){
        const loginOtp = Math.trunc(Math.random() * (999999 - 0) + 0).toString().padStart(6, '0');
        console.log(loginOtp)
    }

    addLoginListener(){
    }
}