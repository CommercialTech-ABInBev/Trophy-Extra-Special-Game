import gif from "../../assets/images/*.gif";
import png from "../../assets/images/*.png";
import AppController from './controller';
import * as Constants from '../utils/constants';
import moment from "moment";
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
        this.addShareListener();
    }

    renderInit(){
        document.querySelector("#home-template").classList.remove("render");
        document.querySelector("#register-template").classList.remove("render");
        document.querySelector("#login-template").classList.remove("render");
        document.querySelector("#result-template").classList.remove("render");
        document.querySelector("#otp-template").classList.remove("render");
        document.querySelector("#leaderboard-template").classList.remove("render");
    }

    serverTimeCheck(){
        return new Promise((resolve, reject) => {
            this.controller.serverNow().then((res) => {
                const serverTime = moment(res.data.data).add(1, 'hours').format("MM-DD-yyyy hh:mm:ss");
                const clientTime = moment().format("MM-DD-yyyy hh:mm:ss");
                const timeDiff = moment(serverTime).diff(moment(clientTime), 'seconds');
                // console.log("Server says ", serverTime);
                // console.log("Client says ", clientTime);
                // console.log("Difference is ", timeDiff);
                if(timeDiff != 0 && timeDiff != 1){
                    reject(false);
                } else {
                    resolve(true);

                }
            }).catch((error) => {
                reject(error);
            });
        });    
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
        const logoutBtn = document.querySelector("#logout-btn");
        const continueBtn = document.querySelector("#continue-btn");
        const shareBtn = document.querySelector("#share-btn");

        restartBtn.classList.add("hide")
        startBtn.classList.add("hide")
        waitBtn.classList.add("hide")
        // homeBtn.classList.add("hide")
        logoutBtn.classList.add("hide")
        continueBtn.classList.add("hide")
        shareBtn.classList.add("hide");
        result.querySelector("#result-img").classList.add("hide");
        result.classList.add("render");
        
        result.querySelector("#result-title").innerHTML = "";
        result.querySelector("#result-subtitle").innerHTML = "";
        result.querySelector("#result-img").src = png["can"];

        const fullCups = this.game.cups.filter((cup) => { return cup.full});

        switch(state){
            case GAMESTATE.INIT:
                 startBtn.classList.remove("hide");
                 logoutBtn.classList.remove("hide")
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
                result.querySelector("#result-subtitle").innerHTML = "We???ve got an Extra Special guest in the house, Cheers!";
                result.querySelector("#result-img").src = gif["congrats"];
                shareBtn.classList.remove("hide")
                waitBtn.classList.remove("hide")
                logoutBtn.classList.remove("hide")
                break;
            case GAMESTATE.GAMEOVER:
                result.querySelector("#result-title").innerHTML = "Waiting Mood";
                setInterval(()=> {
                    result.querySelector("#result-subtitle").innerHTML = `
                        You've exhausted your chance this time. 
                        <br/>Countdown to next turn.
                        <h4 class="mt-4">${this.controller.countDown()}</h4>
                    `;
                }, 1000);
                result.querySelector("#result-img").src = gif["wait"];
                logoutBtn.classList.remove("hide")
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
        if(this.game.user.otp && this.game.user.otp.used){
            this.game.start();
        } else {
            const form = document.querySelector("#login-template")
            form.classList.add("render");    
        }
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
        const logoutBtn = document.querySelector("#logout-btn");
        const leaderboardBtn = document.querySelector("#leaderboard-btn");

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.controller.logout();
            this.renderHome();
        });

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
                        this.popUpToast("bg-info", "Good! You're almost there! ????");
                        this.game.user = x;

                        this.game.start();
                        loginBtnDOM.disabled = false;
                        this.controller.clearForm();

                        // this.controller.sendOTP()
                        //     .then((otp) => {
                        //         this.controller.clearForm();
                        //         loginBtnDOM.disabled = false;
                        //         this.renderOTP();                        
                        //     }).catch((e) => {
                        //         console.log(e);
                        //         loginBtnDOM.disabled = false;
                        //         this.popUpToast("bg-danger", "Couldn't send OTP! ????")
                        //     });
                    }).catch((e) => {
                        console.log(e);
                        loginBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Invalid email address! ????")
                    });
            } else {
                loginBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "Your email address is required! ????");
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
                        this.controller.clearForm();
                        this.game.user.otp.used = true;
                        this.popUpToast("bg-success", "Booze! You're welcome! ????");
                        confirmBtnDOM.disabled = false;
                        this.game.start();
                    }).catch((e) => {
                        console.log(e);
                        confirmBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Invalid OTP Code! ????")
                    });
            
            } else {
                confirmBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "OTP is required! ????");
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
                        this.controller.clearForm();
                        this.popUpToast("bg-success", "Oh great! Your registration is successful ????");
                        registerBtnDOM.disabled = false;
                        this.renderLogin();    
                    }).catch((e) => {
                        console.log(e);
                        registerBtnDOM.disabled = false;
                        this.popUpToast("bg-danger", "Email address has been used! ????");
                    });
            } else {
                registerBtnDOM.disabled = false;
                this.popUpToast("bg-danger", "All fields are required! ????");
            }
        });        
    }

    addShareListener(){
        document.querySelectorAll(".share-channel").forEach((node) => {
            node.addEventListener("click", (e) => {
                e.preventDefault();
                const shareText = "Hey Stout Lover, play the fill-a-cup game and win up to 24 cans of Trophy Extra Special Stout."
                const shareLink = window.location.origin;
                const shareContent = shareText + " " + shareLink;

                const channel = node.getAttribute("data-channel");
                switch(channel){
                    case "whatsapp":
                        window.open(`whatsapp://send?text=${shareContent}`)
                        break;
                    case "twitter":
                        window.open(`https://twitter.com/intent/tweet?text=${shareContent}`)
                        break;
                    case "copy":
                        navigator.clipboard.writeText(shareContent);
                        this.popUpToast("bg-success", "Copied! You can paste now.");
                        break;
                    default:
                        break;
                }
            });
        })
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