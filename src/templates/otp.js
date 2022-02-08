export const OTPTemplate = `
<div class="container-fluid">
<div class="row">
    <div class="col-md-6 offset-md-3 col-sm-12 p-0">
        <div class="card card-dark p-4">
            <h4 class="text-center">One Time Password (OTP)</h4>
            <p>An OTP has been sent to your email address</p>
            <div class="form">
                <div class="m-4">
                  <input type="text" placeholder="Enter OTP here" class="form-control" id="otp" />
                </div>
                <div class="m-4 float-end">
                    <button id="back-btn" class="btn btn-light">Back</button>
                    <button id="otp-btn" class="btn btn-primary">Confirm</button>
                </div>  
            </div>
        </div>
    </div>
</div>
</div>
`