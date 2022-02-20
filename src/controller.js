import axios from 'axios';
import UserService from '/src/firebase/service/userService';

export default class AppController{
    constructor(){
        this.userService = new UserService();
        this.userService.getUsers();
        this.user = {};
    }

    register(model){
        return new Promise((resolve, reject) => {
            if(this.userService.getUserByEmail(model.emailAddress)){
                reject(false);
            } else {
                this.userService.createUser(model);
                resolve(true);    
            }
        })
    }

    login(email){
        return new Promise((resolve, reject) => {
            const task = this.userService.getUserByEmail(email);
            if(task){
                this.user = task;
                resolve(task);
            } else {
                reject("Service error");
            }
        });
    }

    verify(otpCode){
        return new Promise((resolve, reject) => {
            const task = this.user.otp.code === otpCode;
            if(task){
                resolve(task);
            } else {
                reject("Service error");
            }
        });
    }
    
    sendOTP(){
        const otpCode = Math.trunc(Math.random() * (999999 - 0) + 0).toString().padStart(6, '0');
        const nowDate = new Date();
        const expireDate = new Date(nowDate.setHours(nowDate.getHours() + 12));
        this.user.otp = {code: otpCode, expireDate};
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: 'https://client-mailer.herokuapp.com/api/send-mail',
                data: {
                    "from": "ibcommercialtech2@gmail.com",
                    "to": this.user.emailAddress,
                    "subject": "Trophy Extra Special",
                    "html": `<h1>One-time Password</h1><p>${this.user.otp.code}</p>`
                }
            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });    
    }
}