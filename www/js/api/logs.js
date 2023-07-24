const API_PATH_LOGS = 'https://alpha-users-manager.ew.r.appspot.com/'
// const API_PATH_LOGS = 'http://localhost:4000'

const addLog = async (log) => {
    const response = await fetch(`${API_PATH_LOGS}/logs/addLog`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(log)
    })

    return response.json();
}


const getLogs = async (email, logType) => {
    const response = await fetch(`${API_PATH_LOGS}/logList/getLogs?email=${email}&type=${logType}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
    })

    return response.json();
}


const getLastRestart = async (instance) => {
    const response = await fetch(`${API_PATH_LOGS}/logs/last-restart?instance=${instance}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        },
    })

    return response.json();
}