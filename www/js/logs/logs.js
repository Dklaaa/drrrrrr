let username = document.querySelector('.username')
let $tableBody = $(".tbody");
let currentuser;
let sendMailBtn = document.querySelector('.send-mail')
let logoutBtn = document.querySelector('.logout-btn')

let tableTabs = document.querySelectorAll('.table-tab')
let createTab = document.querySelector('.create-tab')
let restartTab = document.querySelector('.restart-tab')
let jobTab = document.querySelector('.job-tab')

tableTabs.forEach((tab => {
    tab.addEventListener('click', () => {
        showLoader(``)
    })
}))


confirmCurrentUser().then(user => {
    if (!user) {
        window.location = '/login.html'
    }
    else {
        const logsbyHash = () => {

            let logType = "restart"

            if (window.location.hash == "#restart") {
                createTab.style.color = 'rgb(209, 209, 209)'
                jobTab.style.color = 'rgb(209, 209, 209)'
                restartTab.style.color = '#fff'
                logType = "restart"
            }
            else if (window.location.hash == "#job") {
                createTab.style.color = 'rgb(209, 209, 209)'
                restartTab.style.color = 'rgb(209, 209, 209)'
                jobTab.style.color = '#fff'
                logType = "job"
            }
            else {
                restartTab.style.color = 'rgb(209, 209, 209)'
                jobTab.style.color = 'rgb(209, 209, 209)'
                createTab.style.color = '#fff'
                logType = "create"
            }

            /* Set display name to dropdown */
            username.innerHTML = user.displayName

            currentuser = user;

            getLogs(currentuser.email, logType).then(response => {

                $('#dtBasicExample').dataTable().fnClearTable();
                $('#dtBasicExample').dataTable().fnDestroy();

                if (response.response == "Insufficient permission.") {
                    // window.location = '/index.html'
                }

                /* Array of all logs */
                let logs = response.logs;

                if (logType == "restart") {
                    logs.forEach(log => {
                        let tr = `<tr >
                                    <td style="padding: 20px" data-uid="${log.creatorId}">${log.createdBy} restarted the <b>${log.company}</b> instance at ${formattedDate(log.time)}</td>>
                                </tr>`

                        $tableBody.append(tr)
                    })
                }
                else if (logType == "job") {
                    logs.forEach(log => {
                        let tr = `<tr >
                                <td style="padding: 20px" data-uid="${log.creatorId}">${log.createdBy} added new job for <b>${log.company}</b>
                                with template: <b>${log.templateName}</b>, organization code: <b>${log.organizationCode}</b>, user code: <b>${log.userCode}</b>
                                and import type: <b>${getImportName(log.importType)}</b> at ${formattedDate(log.time)}</td>
                            </tr>`

                        $tableBody.append(tr)
                    })
                }
                else {
                    logs.forEach(log => {
                        let tr = `<tr >
                                <td style="padding: 20px" data-uid="${log.creatorId}">${log.createdBy} added new user <b>${log.createdUser}</b> for ${log.company} at ${formattedDate(log.time)}</td>>
                            </tr>`

                        $tableBody.append(tr)
                    })
                }


                $(document).ready(function () {
                    $('#dtBasicExample').DataTable({
                        "ordering": false,
                        "bInfo": false,
                        "lengthChange": false,
                        "pageLength": 5,
                        "pagingType": "numbers"
                    });
                    $('.dataTables_length').addClass('bs-select');
                });

                setTimeout(() => {
                    hideLoader()
                }, 1000)
            })
                .catch(error => {
                    // window.location = '/index.html'
                    console.log(error)
                    hideLoader()
                })
        }

        logsbyHash()
        setTimeout(() => {
            hideLoader()
        }, 1000)


        window.addEventListener("hashchange", logsbyHash, false);

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


/* Send password reset email */
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
