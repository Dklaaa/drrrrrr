const API_PATH_SCRIPTS = 'https://alpha-users-manager.ew.r.appspot.com/scripts'
// const API_PATH_SCRIPTS = 'http://localhost:4000/scripts'


const executeScript = async (obj) => {
    const response = await fetch(`${API_PATH_SCRIPTS}/executeScript`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify({connection:obj})
    })

    return response.json();
}