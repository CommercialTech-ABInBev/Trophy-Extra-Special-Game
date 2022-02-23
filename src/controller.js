import axios from 'axios';
import UserService from '/src/firebase/service/userService';

export default class AppController{
    constructor(game){
        this.game = game;
        this.userService = new UserService();
        this.userService.init();
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
                this.game.user = task;
                resolve(task);
            } else {
                reject("Service error");
            }
        });
    }

    verify(otpCode){
        return new Promise((resolve, reject) => {
            const task = this.game.user.otp.code === otpCode;
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
        this.game.user.otp = {code: otpCode, expireDate};
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: 'https://client-mailer.herokuapp.com/api/send-mail',
                data: {
                    "from": "trophystoutgames@gmail.com",
                    "to": this.game.user.emailAddress,
                    "subject": "Trophy Extra Special Bar",
                    "html": `<h1>One-time Password</h1><p>${this.game.user.otp.code}</p>`
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
            daily = {daily: {lives: 3, modifiedOn: this.userService.formatDate()}};
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

    updateDailyCan(){
        const daily = {daily: {lives: 0, modifiedOn: this.userService.formatDate()}};
        const currentCan = this.game.user.can;
        let can = {can: {count: (currentCan.count + 2), modifiedOn: this.userService.formatDate()}};
        this.userService.updateUser(
            this.game.user.id, {...daily, ...can}
        ).then((x) => {
            this.game.user = {...this.game.user, ...daily, ...can};
        }).catch((e) => {
            console.log(e);
        });
    }

    getLeaderboard(){
        return new Promise((resolve, reject) => {
            this.userService.getUsers().then((users) => {
                let leaders = '';
                users = users.filter((u) => {
                    return (u.id && u.fullName && u.can)
                })
                .sort((a,b) => (a.can.modifiedOn < b.can.modifiedOn) ? 1 : ((b.can.modifiedOn < a.can.modifiedOn) ? -1 : 0))
                .sort((a,b) => (a.can.count < b.can.count) ? 1 : ((b.can.count < a.can.count) ? -1 : 0));
                users.forEach((user, index) => {
                    leaders += `
                        <tr>
                            <th scope="row">${index+1}</th>
                            <td>${user.fullName}</td>
                            <td>${user.can.count}</td>
                        </tr>
                    `;                        
                });
                resolve(leaders);
            }).catch((e) => {
                console.log(e);
            });
        });
    }

    checkDaily(){        
        const daily = this.game.user.daily;
        if(daily.lives > 0){
            console.log("Live")
            return true
        }
        const lastDate = new Date(daily.modifiedOn);
        const start = new Date();
        start.setHours(0,0,0,0);

        const isNoon = new Date().getHours() >= 12;
        const noon = new Date();
        noon.setHours(12,0,0,0);

        if(!isNoon && lastDate < start){
            console.log("AM")
            this.updateDaily(true)
            return true
        }

        if(isNoon && lastDate < noon){
            console.log("PM")
            this.updateDaily(true)
            return true
        }
        
        return false;
    }
}