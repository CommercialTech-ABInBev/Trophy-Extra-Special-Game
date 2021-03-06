import axios from 'axios';
import UserService from '../firebase/service/userService';

export default class AppController{
    constructor(game){
        this.game = game;
        this.userService = new UserService();
        this.userService.init();
    }

    clearForm(){
        document.querySelector("#register-template").querySelector("#fullname").value = ""
        document.querySelector("#register-template").querySelector("#email-address").value = ""
        document.querySelector("#register-template").querySelector("#phone-number").value = ""
        document.querySelector("#register-template").querySelector("#city").value = ""
        document.querySelector("#register-template").querySelector("#state").value = ""

        document.querySelector("#login-template").querySelector("#email-address").value = ""
        document.querySelector("#otp-template").querySelector("#otp-code").value = ""
    }

    logout(){
        this.clearForm();
        this.game.user = {};
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
        this.game.user.otp = {code: otpCode, expireDate, used: false};
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: 'https://trophygamesemail.azurewebsites.net/api/send-mail',
                data: {
                    "from": "trophystoutgames@gmail.com",
                    "to": this.game.user.emailAddress,
                    "subject": "Trophy Extra Special Bar",
                    "html": `<h1>One-time Password</h1><p>${this.game.user.otp.code}</p>`
                }, 
                headers: {'API-Auth-Key': '9iU3zyX8IA6UtJxiGDOfgoq0Mcngz1Gir0JnenUfQxZ6AscuTpu0BvRRfuew5H8MXEvAiKAkDCh8mcLbV9sAbsik3fIahjGYzV4u'}
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
            return true
        }
        const lastDate = new Date(daily.modifiedOn);
        const start = new Date();
        start.setHours(0,0,0,0);

        const isNoon = new Date().getHours() >= 12;
        const noon = new Date();
        noon.setHours(12,0,0,0);

        if(!isNoon && lastDate < start){
            this.updateDaily(true)
            return true
        }

        if(isNoon && lastDate < noon){
            this.updateDaily(true)
            return true
        }
        
        return false;
    }

    countDown(){
        const user = this.game.user;
        if(user && user.daily && user.can && user.fullName){
            if(this.checkDaily()){
                window.location.href = window.location.origin
                return "Click home and start game";
            }
        }
        const now = new Date();
        const isNoon = new Date().getHours() >= 12;
        const noon = new Date();
        noon.setHours(12,0,0,0);
        const end = new Date();
        end.setHours(23,59,59,999);

        const ms = isNoon? Math.abs(end - now) : Math.abs(now - noon);
        let seconds = Math.ceil(ms / 1000);
        const hours = parseInt( seconds / 3600 );
        seconds = seconds % 3600;
        const minutes = parseInt( seconds / 60 );
        seconds = seconds % 60;
        return hours+"<sub>hour</sub> : "+minutes+"<sub>minute</sub> : "+seconds+"<sub>seconds</sub> ";
    }

    serverNow(){
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: 'https://trophygamesemail.azurewebsites.net/api/today',
                data: {}, 
                headers: {'API-Auth-Key': '9iU3zyX8IA6UtJxiGDOfgoq0Mcngz1Gir0JnenUfQxZ6AscuTpu0BvRRfuew5H8MXEvAiKAkDCh8mcLbV9sAbsik3fIahjGYzV4u'}
            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });    
    }

    downloadCSV () {
        this.userService.getUsers().then((users) => {
            const data = users.map((user) => {
                return {
                    name: user.fullName.replace(/,/g, ''),
                    email: user.emailAddress.replace(/,/g, ''),
                    phone: user.phoneAddress.replace(/,/g, ''),
                    state: user.state.replace(/,/g, ''),
                    city: user.city.replace(/,/g, ''),
                    can: user.can.count,
                    lastPlayedOn: user.can.modifiedOn.replace(/,/g, '')
                }
            })
            var str = Object.keys(data[0]).join(",") + '\r\n';
            for (var i = 0; i < data.length; i++) {
                var line = '';
                for (var index in data[i]) {
                    line += data[i][index] + ',';
                }
                line.slice(0,line.Length-1); 
                str += line + '\r\n';
            }
            window.open( "data:text/csv;charset=utf-8," + escape(str))    

        }).catch((e) => {
            console.log(e);
        });
    }
}