function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex"; // Affichez la modale en définissant display sur flex
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none"; // Cachez la modale en définissant display sur none
}


function consoleData(event) {
    event.preventDefault();
    dataPrenom = document.querySelector("#prenom");
    dataNom = document.querySelector("#nom");
    dataEmail = document.querySelector("#email");
    dataMessage = document.querySelector("#message");

    console.log(dataPrenom.value, dataNom.value, dataEmail.value, dataMessage.value);
}