import UserService from '/src/firebase/service/userService';

import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class App{
    constructor(game){
        this.game = game;

        this.userService = new UserService();

        // this.userService.getUsers(function(data) {
        //     console.log(data);
        // })
    }

    renderInit(){
        document.querySelector("#home-template").classList.remove("render");
        document.querySelector("#register-template").classList.remove("render");
        document.querySelector("#login-template").classList.remove("render");
    }

    register(registerUserModel){
        this.userService.createUser(registerUserModel);
    }

    menu(){
        this.renderHome();
    }   
    
    renderHome(){
        this.renderInit();
        document.querySelector("#home-template").classList.add("render");

        document.querySelector("#signup-btn").addEventListener("click", (e) => {
            e.preventDefault();
            this.renderRegister();
        });
        document.querySelector("#signin-btn").addEventListener("click", (e) => {
            e.preventDefault();
            this.renderLogin();
        });
    }
    renderRegister(){
        this.renderInit();
        document.querySelector("#register-template").classList.add("render");
        this.addNavButton("#register-template","HOME");
    }
    renderLogin(){
        this.renderInit();
        document.querySelector("#login-template").classList.add("render");

        document.getElementById("login-btn").addEventListener("click", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("email-address")
            console.log(emailInput.value)
            this.renderInit();
            this.game.start();
        });        
        this.addNavButton("#login-template","HOME");
    }

    renderOTP(){
        this.game.appView.innerHTML = OTPTemplate;
        this.game.appView.querySelector("#otp-btn").addEventListener("click", (e) => {
            console.log("Confirmed OTP");
            this.game.start();
        });
        this.addBackButton(LoginTemplate);
    }
    
    addNavButton(id, template){
        document.querySelector(id).querySelector("#back-btn").addEventListener("click", (e) => {
            switch(template){
                case "LOGIN":
                    this.renderLogin();
                    break;
                case "REGISTER":
                    this.renderRegister();
                    break;
                case "HOME":
                    this.renderHome();
                    break;
                default:
                    break;
            }
        });
    }
}