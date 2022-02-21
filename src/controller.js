import axios from 'axios';
import UserService from '/src/firebase/service/userService';

export default class AppController{
    constructor(game){
        this.game = game;
        this.userService = new UserService();
        this.userService.init();
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
                    "from": "trophystoutgames@gmail.com",
                    "to": this.user.emailAddress,
                    "subject": "Trophy Extra Special Bar",
                    "html": `<h1>One-time Password</h1><p>${this.user.otp.code}</p>`
                }
            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });    
    }

    updateDaily(init = false){
        const currentDaily = this.game.user.daily;
        let daily = {daily: {lives: (currentDaily.lives - 1), modifiedOn: this.userService.formatDate()}};
        if(init){
            daily = {daily: {lives: 100}};
        }
        this.userService.updateUser(
            this.game.user.id, daily
        ).then((x) => {
            this.game.user = {...this.game.user,...daily};
        }).catch((e) => {
            console.log(e);
        });
    }

    updateCan(){
        const currentCan = this.game.user.can;
        let can = {can: {count: (currentCan.count + 2), modifiedOn: this.userService.formatDate()}};
        this.userService.updateUser(
            this.game.user.id, can
        ).then((x) => {
            console.log("controller: ",x)
            this.game.user = {...this.game.user,...can};
        }).catch((e) => {
            console.log(e);
        });
    }

}