const auth = firebase.auth(firebaseApp);

const actionCodeSettings = {
    url: "https://su.alpha.al/"
};

/* Logs in user with email and password */
const userLogin = (email, password) => {
    return new Promise((resolve, reject) => {

        auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                resolve(user);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}


/* User log in confirmation */
const confirmCurrentUser = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}


/* Returns current user object */
const currentUser = () => {
    return auth.currentUser;
}


/* Gets id token of current user */
const getIdToken = () => {
    return new Promise((resolve, reject) => {

        if (!auth.currentUser) {
            resolve(null)
        }
        auth.currentUser.getIdToken()
            .then(token => {
                resolve(token)
            })
            .catch(err => {
                reject(err)
            })
    });
}

/* Logs user out */
const logout = () => {
    return new Promise((resolve, reject) => {
        auth.signOut().then((message) => {
            resolve(message)
        }).catch(error => {
            reject(error)
        });
    });
}


const resetPassword = async (email) => {

    return new Promise((resolve, reject) => {
        auth.sendPasswordResetEmail(email, actionCodeSettings).then((res) => {
            resolve(res);
        })
            .catch((err) => {
                reject(err);
            })
    })
}

const verifyEmail = (user) => {
    return new Promise((resolve, reject) => {
        auth.sendEmailVerification(auth.currentUser, actionCodeSettings).then((res) => {
            resolve(res);
        })
            .catch((err) => {
                reject(err); 
            })
    })
}


