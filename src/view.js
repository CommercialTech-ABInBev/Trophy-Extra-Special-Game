import UserService from '/src/firebase/service/userService';
import gif from "../assets/images/*.gif";
import png from "../assets/images/*.png";
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
        document.querySelector("#result-template").classList.remove("render");
        document.querySelector("#otp-template").classList.remove("render");
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
    
    renderResult(state = this.game.gameState){
        this.renderInit();
        const result = document.querySelector("#result-template");
        const leaderboardBtn = document.querySelector("#leaderboard-btn");
        const startBtn = document.querySelector("#start-btn");
        const continueBtn = document.querySelector("#continue-btn");

        leaderboardBtn.classList.add("hide")
        startBtn.classList.add("hide")
        continueBtn.classList.add("hide")
        result.querySelector("#result-img").classList.add("hide");
        result.classList.add("render");
        
        result.querySelector("#result-title").innerHTML = "";
        result.querySelector("#result-subtitle").innerHTML = "";
        result.querySelector("#result-img").src = png["can"];

        switch(state){
            case GAMESTATE.INIT:
                 startBtn.classList.remove("hide");
                break;
            case GAMESTATE.MISSED:
                result.querySelector("#result-title").innerHTML = "Missed";
                result.querySelector("#result-subtitle").innerHTML = "Awk!";
                result.querySelector("#result-img").src = gif["missed"];
                leaderboardBtn.classList.remove("hide")
                break;
            case GAMESTATE.WON:
                result.querySelector("#result-title").innerHTML = "Won";
                result.querySelector("#result-subtitle").innerHTML = "Awesome!";
                result.querySelector("#result-img").src = gif["won"];
                continueBtn.classList.remove("hide");
                break;
            case GAMESTATE.SPILLED:
                result.querySelector("#result-title").innerHTML = "Spilled";
                result.querySelector("#result-subtitle").innerHTML = "Oop!";
                result.querySelector("#result-img").src = gif["spilled"];
                leaderboardBtn.classList.remove("hide")
                break;
            case GAMESTATE.CONGRATS:
                result.querySelector("#result-title").innerHTML = "Congratulations";
                result.querySelector("#result-subtitle").innerHTML = "Wow! You sure are skilled, and won for yourself 2 cans of trophy beer";
                result.querySelector("#result-img").src = gif["congrats"];
                leaderboardBtn.classList.remove("hide")
                break;
            default:
                leaderboardBtn.classList.remove("hide")
                break;
        }

        if([GAMESTATE.MISSED, GAMESTATE.WON, GAMESTATE.SPILLED, GAMESTATE.CONGRATS].includes(state)){
            result.querySelector("#result-img").classList.remove("hide");
        }
        result.querySelector("#result-img").classList.remove("hide");
        
        leaderboardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.game.gameState = GAMESTATE.INIT;
            this.game.start();
        });
    }

    renderRegister(){
        this.renderInit();
        const registerDOM = document.querySelector("#register-template");
        registerDOM.classList.add("render");
        this.addNavButton("#register-template","HOME");

        document.getElementById("register-btn").addEventListener("click", (e) => {
            e.preventDefault();
            const form = document.querySelector("#register-template")
            const nameInput = form.querySelector("#fullname").value
            const emailInput = form.querySelector("#email-address").value
            const phoneNumberInput = form.querySelector("#phone-number").value
            const cityInput = form.querySelector("#city").value
            const stateInput = form.querySelector("#state").value

            if(nameInput && emailInput && phoneNumberInput && cityInput && stateInput){
                if(this.register({
                    fullName: nameInput.trim(),
                    emailAddress: emailInput.trim(),
                    phoneAddress: phoneNumberInput.trim(),
                    city: cityInput.trim(),
                    state: stateInput.trim(),
                })){
                    this.popUpToast("bg-success", "Oh great! Your registration is successful 😀");
                    this.renderLogin();    
                } else {
                    this.popUpToast("bg-danger", "Email address has been used! 🐞");
                }
            } else {
                this.popUpToast("bg-danger", "All fields are required! 🐞");
            }
        });        

    }

    renderLogin(){
        this.renderInit();
        const loginDOM = document.querySelector("#login-template");
        loginDOM.classList.add("render");

        document.getElementById("login-btn").addEventListener("click", (e) => {
            e.preventDefault();
            const form = document.querySelector("#login-template")
            const emailInput = form.querySelector("#email-address").value

            if(emailInput){
                if(this.login(emailInput.trim())){
                    this.popUpToast("bg-success", "Booze! You're welcome! 😀");
                    this.game.start();
                } else {
                    this.popUpToast("bg-danger", "Invalid email address! 🐞")
                }
            } else {
                this.popUpToast("bg-danger", "Your email address is required! 🐞");
            }
        });        
        this.addNavButton("#login-template","HOME");
    }

    renderOTP(){
        this.renderInit();
        const loginDOM = document.querySelector("#otp-template");
        loginDOM.classList.add("render");

        document.getElementById("confirm-btn").addEventListener("click", (e) => {
            e.preventDefault();
            const form = document.querySelector("#otp-template")
            const otpInput = form.querySelector("#otp-code").value

            if(otpInput){
                if(this.login(otpInput.trim())){
                    this.popUpToast("bg-success", "Booze! You're welcome! 😀");
                    this.game.start();
                } else {
                    this.popUpToast("bg-danger", "Invalid OTP Code! 🐞")
                }
            } else {
                this.popUpToast("bg-danger", "OTP is required! 🐞");
            }
        });        
        this.addNavButton("#otp-template","LOGIN");
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

    popUpToast(color="bg-primary", text="Drink!", time=3000){
        document.querySelector("#notification").innerHTML = `
        <div class="toast show align-items-center text-white ${color} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${text}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
        `;
        setTimeout(() => {
            document.querySelector("#notification").innerHTML = "";
        },time)
    }
}