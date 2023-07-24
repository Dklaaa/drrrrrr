confirmCurrentUser().then(user => {
    if (user) {
        window.location = '/'
    }
    else {
        hideLoader()
    }
})


let nameInput = document.querySelector('.name')
let emailInput = document.querySelector('.email')
let passwordInput = document.querySelector('.password')

let signupButton = document.querySelector('.signupBtn')
let modalDescription = document.querySelector(".error-title")
let authFailMessage = document.querySelector('.auth-fail-message')



jQuery(".login100-form").submit(function(e) {
    authFailMessage.innerHTML = ""
    e.preventDefault();

    /* Input values */
    let name = nameInput.value
    let email = emailInput.value
    let password = passwordInput.value

    let user = {
        name,
        email,
        password
    }

    if (name && email && password) {
        userSignup(user).then((user) => {
                showLoader("Signing up...")
                console.log(user)
                if (user.uid && user.docid) {
                    userLogin(email, password).then(user => {
                            verifyEmail(user).then(response => {
                                    window.location = '/verify.html'
                                    console.log(response)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                                hideLoader()
                        })
                        .catch(err => {
                            hideLoader()
                            console.log(err)
                            modalDescription.innerHTML = err.message;
                            $("#error-signup-modal").modal('show');

                        })
                }
                else {
                    let err = user.code
                    authFailMessage.innerHTML = "Sign up failed! - Something went wrong"
                    if(err.toString().includes("invalid-password")) authFailMessage.innerHTML = "Sign up failed! - Invalid password"
                    if(err.toString().includes("email-already-exists")) authFailMessage.innerHTML = "Sign up failed! - Email already exists"
                    authFailMessage.style.display = 'block';
                    hideLoader()
                }
            })
            .catch((error) => {
                authFailMessage.innerHTML = "Sign up failed! - Something went wrong"
                authFailMessage.style.display = 'block';
                hideLoader()
            })
    }

});