import UserService from '/src/firebase/service/userService';
import { HomeTemplate } from './templates/home';
import { RegisterTemplate } from './templates/register';
import { LoginTemplate } from './templates/login';
import { OTPTemplate } from './templates/otp';

import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class App{
    constructor(game){
        this.game = game;
        this.userService = new UserService();

        this.userService.getUsers(function(data) {
            console.log(data);
        })
    }

    register(registerUserModel){
        this.userService.createUser(registerUserModel);
    }

    menu(){
        this.renderHome();
    }   
    
    renderHome(){
        this.game.appView.innerHTML = HomeTemplate;
        this.game.appView.querySelector("#signup-btn").addEventListener("click", (e) => {
            this.renderRegister();
        });
        this.game.appView.querySelector("#signin-btn").addEventListener("click", (e) => {
            this.renderLogin();
        });
    }
    renderRegister(){
        this.game.appView.innerHTML = RegisterTemplate;
        this.game.appView.querySelector("#register-btn").addEventListener("click", (e) => {
            // this.register({
            //     cc_FullName: "Femi Ayodeji",
            //     cc_EmailAddress: "femidotayodeji@gmail.com",
            //     cc_PhoneNumber: "+2348176328528",
            //     cc_City: "Ibadan",
            //     cc__State: "Oyo",
            //     cc_can: 0,
            //     cc_otp: "",
            // });
            this.renderLogin();
        });
        this.addHomeButton();
    }
    renderLogin(){
        this.game.appView.innerHTML = LoginTemplate;
        this.game.appView.querySelector("#login-btn").addEventListener("click", (e) => {
            this.renderOTP();
        });
        this.addHomeButton();
    }

    renderOTP(){
        this.game.appView.innerHTML = OTPTemplate;
        this.game.appView.querySelector("#otp-btn").addEventListener("click", (e) => {
            console.log("Confirmed OTP");
            this.game.start();
        });
        this.addBackButton(LoginTemplate);
    }

    addHomeButton(){
        this.game.appView.querySelector("#cancel-btn").addEventListener("click", (e) => {
            this.renderHome();
        });
    }
    
    addBackButton(template){
        this.game.appView.querySelector("#back-btn").addEventListener("click", (e) => {
            switch(template){
                case LoginTemplate:
                    this.renderLogin();
                    break;
                default:
                break;
            }
        });
    }
}