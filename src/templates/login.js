export const LoginTemplate = (callBack) => {
    const container = document.createElement("div");
    container.classList.add("container-fluid")

    const row = document.createElement("div");
    row.classList.add("row");

    const col = document.createElement("div");
    col.classList.add("col-md-6");
    col.classList.add("offset-md-3");
    col.classList.add("col-sm-12");
    col.classList.add("p-0");

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card-dark");
    card.classList.add("p-4");

    const header = document.createElement("h4");
    header.innerHTML = "Login"
    header.classList.add("text-center")
    const form = document.createElement("div");
    form.classList.add("form")

    const emailControl = document.createElement("div");
    emailControl.classList.add("m-4");
    const emailInput = document.createElement("input");
    emailInput.classList.add("form-control")
    emailInput.setAttribute("placeholder", "Email address")
    emailInput.setAttribute("type", "email")
    emailControl.appendChild(emailInput);

    const buttonControl = document.createElement("div");
    buttonControl.classList.add("m-4")
    buttonControl.classList.add("float-end")

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel"
    cancelButton.classList.add("btn")
    cancelButton.classList.add("btn-light")
    cancelButton.classList.add("mx-2")
    cancelButton.addEventListener("click", function(e){
        e.preventDefault();
        callBack({
            action: "CANCEL", 
        });
    })
    buttonControl.appendChild(cancelButton);

    const continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue"
    continueButton.classList.add("btn")
    continueButton.classList.add("btn-primary")
    continueButton.addEventListener("click", function(e){
        e.preventDefault();
        callBack({
            action: "CONTINUE", 
            data: {email: emailInput.value}            
        });
    })
    buttonControl.appendChild(continueButton);

    card.appendChild(header)
    card.appendChild(form)
    form.appendChild(emailControl)
    form.appendChild(buttonControl)
    col.appendChild(card)
    row.appendChild(col)
    container.appendChild(row)

    return container;
}
