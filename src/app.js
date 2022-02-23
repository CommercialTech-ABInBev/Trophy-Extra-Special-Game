import gif from "../assets/images/*.gif";
import png from "../assets/images/*.png";
import AppController from '/src/controller';
import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class App{
    constructor(game){
        this.game = game;

        this.controller = new AppController(game);
        this.addPageButton(".signup-btn")
        this.addPageButton(".signin-btn")

        this.addNavButton("#login-template","HOME");
        this.addNavButton("#leaderboard-template","HOME");
        this.addNavButton("#register-template","LOGIN");
        this.addNavButton("#otp-template","LOGIN");

        this.addLoginListener();
        this.addOtpListener();
        this.addRegisterListerner();
        this.addResultListener();
    }

    renderInit(){
        document.querySelector("#home-template").classList.remove("render");
        document.querySelector("#register-template").classList.remove("render");
        document.querySelector("#login-template").classList.remove("render");
        document.querySelector("#result-template").classList.remove("render");
        document.querySelector("#otp-template").classList.remove("render");
        document.querySelector("#leaderboard-template").classList.remove("render");
    }

    menu(){
        this.renderHome();
    }   
    
    renderHome(){
        this.renderInit();
        document.querySelector("#home-template").classList.add("render");
    }
    
    renderResult(state = this.game.gameState){
        this.renderInit();
        const result = document.querySelector("#result-template");
        const restartBtn = document.querySelector("#restart-btn");
        const startBtn = document.querySelector("#start-btn");
        const waitBtn = document.querySelector("#wait-btn");
        const homeBtn = document.querySelector("#home-btn");
        const continueBtn = document.querySelector("#continue-btn");

        restartBtn.classList.add("hide")
        startBtn.classList.add("hide")
        waitBtn.classList.add("hide")
        homeBtn.classList.add("hide")
        continueBtn.classList.add("hide")
        result.querySelector("#result-img").classList.add("hide");
        result.classList.add("render");
        
        result.querySelector("#result-title").innerHTML = "";
        result.querySelector("#result-subtitle").innerHTML = "";
        result.querySelector("#result-img").src = png["can"];

        const fullCups = this.game.cups.filter((cup) => { return cup.full});

        switch(state){
            case GAMESTATE.INIT:
                 startBtn.classList.remove("hide");
                break;
            case GAMESTATE.MISSED:
                result.querySelector("#result-title").innerHTML = "Missed";
                result.querySelector("#result-subtitle").innerHTML = "Awk! You lost a chance";
                result.querySelector("#result-img").src = gif["missed"];
                if(this.game.user.daily.lives > 0){
                    restartBtn.classList.remove("hide")
                } else {
                    waitBtn.classList.remove("hide")
                }
                break;
            case GAMESTATE.WON:
                result.querySelector("#result-title").innerHTML = "Won";
                if(fullCups.length === 1){
                    result.querySelector("#result-subtitle").innerHTML = "Well-done, step into our VIP room.";
                } else if(fullCups.length === 2) {
                    result.querySelector("#result-subtitle").innerHTML = "You are Extra Special, Step into our VVIP.";
                } else {
                    result.querySelector("#result-subtitle").innerHTML = "Awesome!";                    
                }
                result.querySelector("#result-img").src = gif["won"];
                continueBtn.classList.remove("hide");
                break;
            case GAMESTATE.SPILLED:
                result.querySelector("#result-title").innerHTML = "Spilled";
                result.querySelector("#result-subtitle").innerHTML = "Oop! you lost a chance";
                result.querySelector("#result-img").src = gif["spilled"];
                if(this.game.user.daily.lives > 0){
                    restartBtn.classList.remove("hide")
                } else {
                    waitBtn.classList.remove("hide")
                }
                break;
            case GAMESTATE.CONGRATS:
                result.querySelector("#result-title").innerHTML = "Congratulations";
                result.querySelector("#result-subtitle").innerHTML = "We’ve got an Extra Special guest in the house, Cheers!";
                result.querySelector("#result-img").src = gif["congrats"];
                waitBtn.classList.remove("hide")
                break;
            case GAMESTATE.GAMEOVER:
                result.querySelector("#result-title").innerHTML = "Waiting Mood";
                setInterval(()=> {
                    result.querySelector("#result-subtitle").innerHTML = `
                        You've exhausted your chance. 
                        <br/>Counting down to next turn.
                        <h3 class="mt-4">${this.controller.countDown()}</h3>
                    `;
                }, 1000);
                result.querySelector("#result-img").src = gif["wait"];
                homeBtn.classList.remove("hide")
                break;
            default:
                restartBtn.classList.remove("hide")
                break;
        }

        if([GAMESTATE.MISSED, GAMESTATE.WON, GAMESTATE.SPILLED, GAMESTATE.CONGRATS].includes(state)){
            result.querySelector("#result-img").classList.remove("hide");
        }
        result.querySelector("#result-img").classList.remove("hide");        
    }

    renderRegister(){
        this.renderInit();
        const form = document.querySelector("#register-template")
        form.classList.add("render");
    }

    renderLogin(){
        this.renderInit();
        const form = document.querySelector("#login-template")
        form.classList.add("render");
    }

    renderOTP(){
        this.renderInit();
        const form = document.querySelector("#otp-template")
        form.classList.add("render");
        document.getElementById("user-email-address").innerHTML = this.game.user.emailAddress;
    }

    renderLeaderboard(){
        this.renderInit();
        const board = document.querySelector("#leaderboard-template")
        board.classList.add("render");
        board.querySelector("#table-data").innerHTML = `<div class="lds-dual-ring"></div>`;
        this.controller.getLeaderboard().then((leaders) => {
            board.querySelector("#table-data").innerHTML = leaders;
        });
    }

    addNavButton(selector, template){
        document.querySelector(selector).querySelectorAll(".back-btn").forEach((node) => {
            node.addEventListener("click", (e) => {
                e.preventDefault();
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
        })
    }

    addPageButton(selector){
        document.querySelectorAll(selector).forEach((node) => {
            node.addEventListener("click", (e) => {
                e.preventDefault();
                switch(selector){
                    case ".signin-btn":
                        this.renderLogin();
                        break;
                    case ".signup-btn":
                        this.renderRegister();
                        break;
                    default:
                        break;
                }
            });
        })
    }

    addResultListener(){
        const restartBtn = document.querySelector("#restart-btn");
        const waitBtn = document.querySelector("#wait-btn");
        const homeBtn = document.querySelector("#home-btn");
        const leaderboardBtn = document.querySelector("#leaderboard-btn");

        leaderboardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.renderLeaderboard();
        });

        restartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.game.input.sound(this.game.input.startSound);
            this.game.gameState = GAMESTATE.INIT;
            this.game.start();
        });
        waitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.game.input.sound(this.game.input.overSound);
            this.game.gameState = GAMESTATE.GAMEOVER;
            this.renderResult();
        });
        homeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.game.input.sound(this.game.input.pourSound);
            this.game.gameState = GAMESTATE.INIT;
            this.renderHome();
        });

    }

    addLoginListener(){
        const form = document.querySelector("#login-template")
        const emailInputDOM = form.querySelector("#email-address")
        const loginBtnDOM = document.getElementById("login-btn");
        loginBtnDOM.addEventListener("click", (e) => {
            e.preventDefault();
            loginBtnDOM.disabled = true;
            const emailInput = emailInputDOM.value
            if(emailInput){
                this.controller.login(emailInput.trim())
                    .then((x) => {
                        this.popUpToast("bg-info", "Good! Almost there! 😀");
                        this.game.user = x;

                        this.game.start();
                        loginBtnDOM.disabled = false;

                        // this.controller.sendOTP()
                        //     .then((otp) => {
                        //         loginBtnDOM.disabled = false;
                        //         this.renderOTP();                        
                        //     }).catch((e) => {
                        //         console.log(e);
                        //         loginBtnDOM.disabled = false;
                        //         this.popUpToast("bg-danger", "Couldn't send OTP! 🐞")
                        //     });
                    }).catch((e) => {
                        console.log(e);
                        loginBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Invalid email address! 🐞")
                    });
            } else {
                loginBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "Your email address is required! 🐞");
            }
        });
    }

    addOtpListener(){
        const form = document.querySelector("#otp-template")
        const otpInputDOM = form.querySelector("#otp-code")
        const confirmBtnDOM = document.getElementById("confirm-btn");
        const resendOtpBtnDOM = document.getElementById("resend-otp-btn");

        otpInputDOM.addEventListener("keyup", (e) => {
            if(otpInputDOM.value.trim().length === 6){
                confirmBtnDOM.focus()
            }
        });

        resendOtpBtnDOM.addEventListener("click", (e) => {
            e.preventDefault();
            this.controller.sendOTP();
        });        

        confirmBtnDOM.addEventListener("click", (e) => {
            e.preventDefault();
            confirmBtnDOM.disabled = true;
            const otpInput = otpInputDOM.value

            if(otpInput){
                this.controller.verify(otpInput.trim())
                    .then((x) => {
                        this.popUpToast("bg-success", "Booze! You're welcome! 😀");
                        confirmBtnDOM.disabled = false;
                        this.game.start();
                    }).catch((e) => {
                        console.log(e);
                        confirmBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Invalid OTP Code! 🐞")
                    });
            
            } else {
                confirmBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "OTP is required! 🐞");
            }
        });        
    }

    addRegisterListerner(){
        const form = document.querySelector("#register-template")
        const registerBtnDOM = document.getElementById("register-btn");
        registerBtnDOM.addEventListener("click", (e) => {
            e.preventDefault();
            registerBtnDOM.disabled = true;
            const nameInput = form.querySelector("#fullname").value
            const emailInput = form.querySelector("#email-address").value
            const phoneNumberInput = form.querySelector("#phone-number").value
            const cityInput = form.querySelector("#city").value
            const stateInput = form.querySelector("#state").value

            if(nameInput && emailInput && phoneNumberInput && cityInput && stateInput){
                const newUser = {
                    fullName: nameInput.trim(),
                    emailAddress: emailInput.trim(),
                    phoneAddress: phoneNumberInput.trim(),
                    city: cityInput.trim(),
                    state: stateInput.trim(),
                };
                this.controller.register(newUser)
                    .then((x) => {
                        this.popUpToast("bg-success", "Oh great! Your registration is successful 😀");
                        registerBtnDOM.disabled = false;
                        this.renderLogin();    
                    }).catch((e) => {
                        console.log(e);
                        registerBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Email address has been used! 🐞");
                    });
            } else {
                registerBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "All fields are required! 🐞");
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