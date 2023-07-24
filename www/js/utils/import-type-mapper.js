
const getImportName = (jobUrl) => {

    let job;

    switch (jobUrl) {
        case '/WebService_Automatizim.asmx/importAutomatikShitjeBlerje':
            job = 'Shitje / Blerje';
            break;
        case '/webService_Vod.asmx/importAutomatikVeprimeKF':
            job = 'Veprime kliente/furnitore';
            break;
        case '/webService_Vod.asmx/importAutomatikVeprimeArkaBanka':
            job = 'Veprime arka/banka';
            break;
        default:
            break;
    }

    return job;
}