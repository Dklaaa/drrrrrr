const API_PATH_ORG = 'https://alpha-users-manager.ew.r.appspot.com/organisations'
// const API_PATH_ORG = 'http://localhost:4000/organisations'

const getOrganisations = async (uid) => {
    const response = await fetch(`${API_PATH_ORG}/getOrganisations?uid=${uid}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${await getIdToken()}`
        }
    })

    return response.json();
}