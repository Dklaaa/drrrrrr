let form = document.querySelector('.login100-form')
let sendMailBtn = document.querySelector('.send-mail')
let emailPasswordReset = document.querySelector('#email-password-reset')
let authFailMessage = document.querySelector('.auth-fail-message')

confirmCurrentUser().then(user => {
    if (user) {
        if (user.emailVerified) {
            window.location = '/'
           
        } else {
            window.location = '/verify.html'
        }
        console.log(user)
    }
    else {
        hideLoader()
    }
})


let emailInput = document.querySelector('.email')
let passwordInput = document.querySelector('.password')

let loginButton = document.querySelector('.loginBtn')

loginButton.addEventListener('click', (e) => {
    authFailMessage.innerHTML = '';
    if (form.checkValidity() === false) {
        return
    } else {
        e.preventDefault()
        showLoader("Logging in...");
            /* Input values */
        let email = emailInput.value
        let password = passwordInput.value

        if (email && password) {
            userLogin(email, password).then(user => {
                    if (user.user.emailVerified) {
                        window.location = '/'
                    } else {
                        verifyEmail(user).then(response => {
                                window.location = '/verify.html'
                                console.log(response)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    hideLoader()
                    authFailMessage.innerHTML = "Login in failed! - Something went wrong"
                    if(err.toString().includes("user-not-found")) authFailMessage.innerHTML = "Login in failed! - User doesn't exist"
                    if(err.toString().includes("wrong-password")) authFailMessage.innerHTML = "Login in failed! - Wrong password"
                    authFailMessage.style.display = 'block';
                    console.log(err)
                })
        }
    }
})

sendMailBtn.addEventListener('click', (e) => {
    if (validateForm("#reset-form") && emailPasswordReset.value) {
        resetPassword(emailPasswordReset.value).then((res) => {
                $('#reset-password-modal').modal('hide');
                $('.email-confirm-modal').modal('show');
            })
            .catch(error => {
                console.log(error, "Email failed to send.")
                $('#reset-password-modal').modal('hide');
            })
    }
})