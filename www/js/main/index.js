/* Selectors */
let username = document.querySelector('.username')
let tableBody = document.querySelector('.tbody')
let $tableBody = $(".tbody");
let $tableBodyMobile = $(".tableBodyMobile");

let logoutBtn = document.querySelector('.logout-btn')
let userForm = document.querySelector('#user-form')
let $modalContainer = $(".confirmation-modal-container")
let sendMailBtn = document.querySelector('.send-mail')
let emailPasswordReset = document.querySelector('#email-password-reset')


/* User selectors */
let userName = document.querySelector('.user-name')
let userPassword = document.querySelector('.user-password')
let usernameHash = document.querySelector('.input-group-text')
let createUserBtn = document.querySelector('.create-user-btn')
let createJobBtn = document.querySelector('.create-job-btn')
let createScriptBtn = document.querySelector('.create-script-btn')


let logsDropdown = document.querySelector('.logs-dropdown')

let currentuser;

let server;
let database;
let companies;
let company_code;
let client_code;
let template_name;

let instances = []



/* Check for user login */
confirmCurrentUser().then(user => {
    if (!user) {
        window.location = '/login.html'
    } else {

        /* Set display name to dropdown */
        user.displayName ? username.innerHTML = user.displayName : username.innerHTML = "My Account"
        // console.log(user)

        /* Add "Logs" element to dropdown */
        if (user.email == "axhepaliu@gmail.com" || user.email == "dorel.raco@imb.al" || user.email == "guenda.preci@imb.al" || user.email == "henrik.balla@imb.al" || user.email == "kerolina.mane@imb.al") {
            logsDropdown.style.display = "block"
        }

        /* Set user variable */
        currentuser = user;



        /* Get organisations */
        getOrganisations(currentuser.uid).then(organisations => {

            /* Send to verify email page */
            if (organisations.verified === false) {
                window.location = '/verify.html'
            } else {

                /* Get organisations */
                let recordsets = organisations.organisations.recordset

                /* Append each orgnaisation to a table for desktop */
                recordsets.forEach(recordset => {
                    let tr = `
                    <tr>
                        <td class="d-flex px-3 py-3 bg-white border-10 shadow-sm mb-4">
                            <div class="d-flex flex-column col-4">                            
                                <h5 class="mb-2 font-weight-bold mb-2">${recordset.name}</h5>
                                <div class="d-flex">
                                    <h6 class="text-muted mr-2"><em>Last restart: </em></h6>
                                    <h6 class="instance-last-restart" data-location=${recordset.LOCATION}>-</h6>      
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center col-8" data-org='${JSON.stringify(recordset)}'>
                                <button class="col-3 btn restart-instance-btn action-btn">Restart <i class="ms-1 ml-1 fa fa-refresh" data-location=${recordset.LOCATION}></i></button>
                                <button class="col-3 btn add-user-btn action-btn">Add user <i class="ms-1 ml-1 fa fa-user" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                                <button class="col-3 btn add-job-btn action-btn">Add job<i class="ms-1 ml-1 fa fa-tasks" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                                <button class="col-3 btn add-script-btn action-btn">Execute Script<i class="ms-1 ml-1 fa fa-flash" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                            </div>
                        </td>
                    </tr>`

                    $tableBody.append(tr)
                })


                /* Mobile data */
                recordsets.forEach(recordset => {
                    let card = `
                    <tr>
                        <td class="d-flex flex-column border-7 px-3 py-4 bg-white mb-3">
                            <h5 class="mb-2 font-weight-bold mb-2">${recordset.name}</h5>
                            <div class="d-flex mb-4">
                                <h6 class="text-muted mr-2"><em>Last restart: </em></h6>
                                <h6 class="instance-last-restart" data-location=${recordset.LOCATION}>-</h6>      
                            </div>
                            <div class="d-flex justify-content-between w-100" data-org='${JSON.stringify(recordset)}'>
                                <button class="col-3 btn restart-instance-btn action-btn"><i class="fa fa-refresh" data-location=${recordset.LOCATION}></i></button>
                                <button class="col-3 btn add-user-btn action-btn"><i class="fa fa-user" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                                <button class="col-3 btn add-job-btn action-btn"><i class="fa fa-tasks" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                                <button class="col-3 btn add-script-btn action-btn"><i class="ms-1 ml-1 fa fa-flash" data-database=${recordset.name} data-server=${recordset.server}></i></button>
                            </div>
                        </td>
                    </tr>`
                    $tableBodyMobile.append(card)
                    instances.push(recordset.LOCATION)
                })




                instances = instances.filter((value, index, el) => el.indexOf(value) === index)
                companies = document.querySelectorAll(".instance-last-restart")

                instances.forEach(instance => {
                    lastRestart(instance)
                })


                /* Create data table */
                $(document).ready(function () {
                    $('#dtDesktop').DataTable({
                        "ordering": false,
                        "bInfo": false,
                        "lengthChange": false,
                        "pageLength": 5,
                        "pagingType": "numbers",
                        "responsive": true,
                        "columnDefs": [
                            { width: '25%', targets: 0 }
                        ],
                    });
                    $('.dataTables_length').addClass('bs-select');
                });


                /* Create data table for mobile */
                $(document).ready(function () {
                    $('#dtMobile').DataTable({
                        "ordering": false,
                        "bInfo": false,
                        "lengthChange": false,
                        "pageLength": 5,
                        "pagingType": "numbers",
                        "responsive": true,
                        "columnDefs": [
                            { width: '25%', targets: 0 }
                        ],
                    });
                    $('.dataTables_length').addClass('bs-select');
                });




                /* Create events for each organisation and set model data */
                let addUserModalBtn = document.querySelectorAll('.add-user-btn')


                /* Add event listeners for add user */
                addUserModalBtn.forEach(userBtn => {

                    userBtn.addEventListener('click', (e) => {

                        /* Get clicked button organisation data */
                        const instanceParent = e.currentTarget.parentElement
                        const instanceData = JSON.parse(instanceParent.dataset.org)

                        /* Set database and server */
                        database = instanceData.name.trim()
                        server = instanceData.server.trim()

                        /* Remove modal backdrop closure */
                        $('.user-modal').modal({
                            keyboard: false
                        })

                        /* Update modal title for each modal */
                        $('#user-modal-title').html(`
                            <h6>Add user for <strong>${database}</strong></h6>`
                        )

                        /* Generate ID for every new user */
                        usernameHash.innerHTML = generateId()
                    })
                })


                /* Create event for job */
                let addJobModalBtn = document.querySelectorAll('.add-job-btn');

                /* Add event listeners for add job */
                addJobModalBtn.forEach(jobBtn => {

                    jobBtn.addEventListener('click', (e) => {

                        /* Get clicked button organisation data */
                        const instanceParent = e.currentTarget.parentElement
                        const instanceData = JSON.parse(instanceParent.dataset.org)

                        /* Set database and server */
                        database = instanceData.name
                        server = instanceData.server

                        /* Remove modal backdrop closure */
                        $('.job-modal').modal({
                            keyboard: false
                        })

                        /* Update modal title for each modal */
                        $('#job-modal-title').html(`
                            <h6>Add job for <strong>${database}</strong></h6>`
                        )

                    })
                })
                let addScriptModalBtn = document.querySelectorAll('.add-script-btn');

                /* Add event listeners for add job */
                addScriptModalBtn.forEach(scriptBtn => {

                    scriptBtn.addEventListener('click', (e) => {

                        /* Get clicked button organisation data */
                        const instanceParent = e.currentTarget.parentElement
                        const instanceData = JSON.parse(instanceParent.dataset.org)

                        /* Set database and server */
                        database = instanceData.name
                        server = instanceData.server

                        /* Remove modal backdrop closure */
                        $('.script-modal').modal({
                            keyboard: false
                        })

                        /* Update modal title for each modal */
                        $('#script-modal-title').html(`
                            <h6>Execute script for <strong>${database}</strong></h6>`
                        )

                    })
                })


                /* Create event for each restart instance button */
                let restartInstanceButtons = document.querySelectorAll('.restart-instance-btn')

                restartInstanceButtons.forEach(restartBtn => {

                    restartBtn.addEventListener('click', (e) => {

                        /* Get clicked button organisation data */
                        const instanceParent = e.currentTarget.parentElement
                        const instanceData = JSON.parse(instanceParent.dataset.org)

                        /* Get instance location */
                        let location = instanceData.LOCATION
                        let database = instanceData.name

                        showLoader(`Restarting instance for ${database}...`)


                        let instance = {
                            instancelist: [location.toString()],
                        }

                        restartInstance(instance).then(response => {
                            if (response.success) {
                                hideLoader()
                                $('.restart-confirm-modal').modal('show');

                                let log = {
                                    company: database,
                                    createdBy: currentuser.displayName,
                                    creatorId: currentuser.uid,
                                    type: "restart",
                                    instance: location
                                }

                                addLog(log).then(result => {
                                    console.log(result)
                                }).catch(error => {
                                    console.log(error)
                                })
                            }
                            else {
                                hideLoader()
                                $('.restart-error-modal').modal('show');
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    })
                })


                /* Create data table for logs*/
                $(document).ready(function () {
                    $('#dtBasicExample').DataTable({
                        "ordering": false,
                        "bInfo": false,
                        "lengthChange": false,
                        "pageLength": 5,
                        "pagingType": "numbers",
                        "responsive": true,
                        "columnDefs": [
                            { width: '25%', targets: 0 }
                        ],
                    });
                    $('.dataTables_length').addClass('bs-select');
                });
            }
            hideLoader()
        }).catch(error => {
            console.log(error)
            hideLoader();
        })

    }
})


/* Log user out */
logoutBtn.addEventListener('click', () => {
    logout().then(user => {
        console.log("User signed out successfully.")
        window.location = '/login.html'
    }).catch(error => {
        console.log("Error signing out." + error)
    })
})


/* Create user listener */
createUserBtn.addEventListener('click', (e) => {

    showLoader(`Creating user for ${database}...`)

    if (validateForm("#user-form") && database && server) {
        let connection = {
            database,
            server,
            username: userName.value + "-" + usernameHash.innerHTML,
            passwordclient: userPassword.value
        }

        console.log(connection)

        createUser(connection).then(respond => {

            let paresedResponse = JSON.parse(respond.message)

            if (paresedResponse || paresedResponse.database != "") {

                $('.user-modal').modal('hide');

                let modal = `<div class="modal confirmation-modal fade ${connection.username}" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" style="width: 500px;" role="document">
                                    <div class="modal-content" style="border: none;">
                                        <div class="modal-header conf-modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">User created successfully</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body conf-modal-body">
                                            <h5 id=${connection.username}>${connection.username}</h5><i class="fa fa-copy copy-button"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>`


                $modalContainer.append(modal)

                let copyButtons = document.querySelectorAll('.copy-button')

                copyButtons.forEach(copyButton => {
                    copyButton.addEventListener('click', (e) => {
                        let usernameToCopy = e.target.previousElementSibling
                        CopyToClipboard(usernameToCopy.id)
                    })
                })

                let modalClass = '.' + connection.username;
                hideLoader()
                $(modalClass).modal('show');

                let log = {
                    company: database,
                    username: connection.username,
                    createdBy: currentuser.displayName,
                    creatorId: currentuser.uid,
                    type: "create"
                }

                addLog(log).then(result => {
                    console.log(result)
                })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                hideLoader()
                $('.user-error-modal').modal('show');
            }
        })
            .catch(error => {
                console.log(error)
                hideLoader()
                $('.user-error-modal').modal('show');
            })
    }
    else {
        hideLoader()
    }

})

createScriptBtn.addEventListener('click', () => {

    if (validateForm("#script-form") && database && server) {

        showLoader(`Executing script for ${database}...`)
        $('.user-modal').modal('hide');

        let connection = {
            database,
            server,
            script: $('#scriptsOptions').val()
        }

        executeScript(connection)
            .then(result => {

                hideLoader()
                $('.script-modal').modal('hide');
                if (result) alert("Skripti u ekzekutua me sukses!");
                else alert("Skripti nuk u ekzekutua, provoni perseri me vone!");

                let log = {
                    company: connection.database,
                    userCode: connection.user,
                    createdBy: currentuser.displayName,
                    creatorId: currentuser.uid,
                    type: "execute",
                    script: connection.script
                }

                addLog(log)
                    .then(result => {
                        console.log(result)
                    }).catch(error => {
                        console.log(error)
                    })
            })
            .catch(err => {
                console.log(err)
                hideLoader()
                alert("Failed to execute script!");
                $('.script-modal').modal('hide')
            })
    }
})

createJobBtn.addEventListener('click', (e) => {

    if (validateForm("#job-form") && database && server) {


        showLoader(`Creating job for ${database}...`)

        $('.user-modal').modal('hide');

        let job;

        switch ($('#exampleInputText6').val()) {
            case 'Shitje/Blerje':
                job = '/WebService_Automatizim.asmx/importAutomatikShitjeBlerje';
                break;
            case 'Veprime kliente/furnitore':
                job = '/webService_Vod.asmx/importAutomatikVeprimeKF';
                break;
            case 'Veprime arka/banka':
                job = '/webService_Vod.asmx/importAutomatikVeprimeArkaBanka';
                break;
            default:
                job = '';
                break;
        }

        let connection = {
            database,
            server,
            importName: $(".template-name").val(),
            importOrganization: $(".organization-code").val(),
            user: $(".user-code").val(),
            importType: job
        }

        createJob(connection).then(result => {

            hideLoader()
            $('.job-modal').modal('hide')
            if (result.message === 'Job-i nuk u krijua!')
                alert('Job-i nuk u krijua!');
            else
                alert("Job created successfully!");

            let log = {
                company: database,
                templateName: connection.importName,
                organizationCode: connection.importOrganization,
                userCode: connection.user,
                importType: connection.importType,
                createdBy: currentuser.displayName,
                creatorId: currentuser.uid,
                type: "job"
            }

            addLog(log).then(result => {
                console.log(result)
            }).catch(error => {
                console.log(error)
            })

        }).catch(error => {
            hideLoader()
            console.log(error)
            alert("Failed to create job!");
            $('.job-modal').modal('hide')
        })
    }
})

sendMailBtn.addEventListener('click', (e) => {
    if (currentuser.email) {
        resetPassword(currentuser.email).then((res) => {
            console.log(res, "Email sent.");
            $('#reset-password-modal').modal('hide');
            $('.email-confirm-modal').modal('show');
        })
            .catch(error => {
                console.log(error, "Email failed to send.")
                $('#reset-password-modal').modal('hide');
            })
    }
})


const lastRestart = (instance) => {
    setTimeout(() => {
        getLastRestart(instance).then(restartTime => {
            if (restartTime.response.time) {
                companies.forEach(company => {
                    if (company.getAttribute('data-location') == instance) {
                        company.innerHTML = formattedDate(restartTime.response.time)
                    }
                })
            }
        }).catch(error => {
            console.log(error)
            company.innerHTML = "-"
        })
    }, 1000)
}


$(".restart-confirm-modal").on('hidden.bs.modal', function () {
    window.location.reload()
});

