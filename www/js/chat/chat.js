/* Selectors */
let username = document.querySelector('.username')
let logoutBtn = document.querySelector('.logout-btn')
let logsDropdown = document.querySelector('.logs-dropdown')


/* Text form data */
const chatForm = document.querySelector('#chat-form');
const sendToText = document.querySelector('.send-to-text');
const messageText = document.querySelector('.editor');

let currentU; 


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
        currentU = user;
    }

    hideLoader()
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


chatForm.addEventListener('submit', async (e) => {


    e.preventDefault();

   var editorContent = tinymce.activeEditor.getContent(); // Get the HTML content as a string

    // Create a temporary div element to hold the content as DOM elements
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;

    // Query for all images within the temporary div
    var images = tempDiv.querySelectorAll('img');

    for (var i = 0; i < images.length; i++) {
        images[i].setAttribute('width', '300');
        images[i].setAttribute('height', '200');
    }
    var updatedContent = tempDiv.innerHTML;

    if (chatForm.checkValidity() === false) {
        alert("Enter a recipient!")
        return
    } else {

    
        const messageObject = {
            room: sendToText.value,
          //  message: $('.editor').val(),
         // message: tinymce.activeEditor.getContent(),
         message: updatedContent,
            user: currentU.email,
        }

        try {
            const response = await sendMessage(messageObject);
            if (response?.message?.success) {
                alert(response.message.message)
            }
            else {
                alert("Failed to send the message!")
            }
        }
        catch (error) {
            alert("Failed to send the message!")
            console.error(error);
        }
        finally {
            chatForm.reset()
        }
    }


})



