function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function consoleData(event) {
    event.preventDefault();
    dataPrenom = document.querySelector("#prenom");
    dataNom = document.querySelector("#nom");
    dataEmail = document.querySelector("#email");
    dataMessage = document.querySelector("#message");

    console.log(dataPrenom.value, dataNom.value, dataEmail.value, dataMessage.value);
}