let username = document.querySelector('.username')
let logoutBtn = document.querySelector('.logout-btn')

confirmCurrentUser().then(user => {
    if (user) {
        user.displayName ? username.innerHTML = user.displayName : username.innerHTML = "My Account"
        hideLoader()
        if (user.emailVerified) {
            window.location = '/'
        }
    } else {
        window.location = '/login.html'
    }
})


logoutBtn.addEventListener('click', () => {
    logout().then(user => {
        console.log("User signed out successfully.")
        window.location = '/login.html'


    }).catch(error => {
        console.log("Error signing out." + error)
    })
})