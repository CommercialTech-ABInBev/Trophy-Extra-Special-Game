export const RegisterTemplate = `
<div class="container-fluid">
<div class="row">
    <div class="col-md-6 offset-md-3 col-sm-12 p-0">
        <div class="card card-dark p-4">
            <h4 class="text-center">Register</h4>
            <div class="form">
                <div class="m-4">
                  <input type="text" placeholder="Full name" class="form-control" id="fullname" />
                </div>
                <div class="m-4">
                  <input type="email" placeholder="Email address" class="form-control" id="email-address" />
                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="m-4">
                  <input type="text" placeholder="Phone number" class="form-control" id="phone-number" />
                </div>
                <div class="row">
                    <div class="col">
                        <div class="mx-4">
                            <input type="text" placeholder="City" class="form-control" id="city" />
                        </div>        
                    </div>
                    <div class="col">
                        <div class="mx-4">
                            <input type="text" placeholder="State" class="form-control" id="state" />
                        </div>              
                    </div>
                </div>
                <div class="m-4 float-end">
                    <button id="cancel-btn" class="btn btn-light">Cancel</button>
                    <button id="register-btn" class="btn btn-primary">Submit</button>
                </div>  
            </div>
        </div>
    </div>
</div>
</div>
`