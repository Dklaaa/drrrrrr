const API_PATH_USER = 'https://alpha-users-manager.ew.r.appspot.com/user';
// const API_PATH_USER = 'http://localhost:4000/user'

const userSignup = async (data) => {
    console.log(data);
    const response = await fetch(`${API_PATH_USER}/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response.json();
}


const createUser = async (userdata) => {

    const response = await fetch(`${API_PATH_USER}/addUser`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(userdata)
    })

    return response.json();
}


const restartInstance = async (instance) => {

    const response = await fetch(`${API_PATH_USER}/restartInstance`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(instance)
    })

    return response.json();
}


const createJob = async  (instance) => {
    const response = await fetch(`${API_PATH_USER}/createJob`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(instance)
    })

    return response.json();
}


const sendMessage = async (message) => {
    const response = await fetch(`${API_PATH_USER}/sendMessage`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(message)
    })

    return response.json();
}