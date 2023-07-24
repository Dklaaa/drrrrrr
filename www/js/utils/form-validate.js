//Form validation
const validateForm = (form) => {
    let formElement = document.querySelector(form);
    formElement.classList.add("was-validated");

    if (!formElement.checkValidity()) {
        document.querySelectorAll(form + " input.validate")
            .forEach(function (input) {
                if (!input.checkValidity()) {
                    input.classList.add("invalid");
                }
            });
        return false;
    } else {
        formElement.classList.remove("was-validated");
        return true;
    }
}