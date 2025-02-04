const urlParams = new URLSearchParams(window.location.search);
const photographerId = parseInt(urlParams.get('id')); // Assurez-vous que l'ID est converti en nombre entier


let slideIndex = 1;
const mediaItems = [];


// // Sort by date
// const sortByDate = (mediaArray) => {
//     return mediaArray.sort((a, b) => new Date(a.date) - new Date(b.date));
// }

// // Sort by likes
// const sortByLikes = (mediaArray) => {
//     return mediaArray.sort((a, b) => b.likes - a.likes);
// }

// // Sort by title
// const sortByTitle = (mediaArray) => {
//     return mediaArray.sort((a, b) => a.title.localeCompare(b.title));
// }

function displayMedia(mediaArray) {
    const mediaSection = document.getElementById('media-section');
    
    if (!mediaSection) {
        console.error("No mediaSection element found. Please ensure you have an element with the ID 'mediaSection' in your HTML.");
        return;
    }
    mediaSection.innerHTML = ''; // Clear previous media

    if (mediaArray.length > 0) {
        for (let i = 0; i < mediaArray.length; i++) {
            const mediaCard = mediaTemplate(mediaArray[i],i).getMediaCardDOM();
            mediaSection.appendChild(mediaCard);
        }
    } else {
        console.log("Aucun média trouvé pour l'ID du photographe:", photographerId);
    }
    const likeCounters = document.querySelectorAll('.like-counter');
    likeCounters.forEach(counter => {
        counter.addEventListener('click', handleLikeClick);
    });

}

// Fetch Data from JSON

async function getMedia() {
    try {
        const response = await fetch("data/photographers.json");
        const data = await response.json();
        
        return {
            media: data.media || [],
            photographers: data.photographers || []
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { media: [], photographers: [] };
    }
}


function calculateTotalLikes(mediaArray) {
    return mediaArray.reduce((total, media) => total + media.likes, 0);
}

// Main Function 

async function main() {

    const { media, photographers } = await getMedia();
        
    if (!media || !photographers) {
        console.error('Data fetch error: No media or photographers data available.');            return;
    }
    
    let photographerDetails = null;

    // Loop through photographers to find the matching one
    
    for (let i = 0; i < photographers.length; i++) {
        if (photographers[i].id === photographerId) {
            photographerDetails = photographers[i];
            break;
        }
    }

    // Display photographer details
    if (photographerDetails) {
        const photographerSection = photographerTemplate(photographerDetails);
        document.body.appendChild(photographerSection);
    }

    // Loop through media to find those that match the photographer's ID
    const matchingMedia = [];
    for (let i = 0; i < media.length; i++) {
        if (media[i].photographerId === photographerId) {
            matchingMedia.push(media[i]);
        }
    }


// ///////////////////////////////////////

// Fonctions de tri
const sortByDate = (mediaArray) => {
    return mediaArray.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const sortByLikes = (mediaArray) => {
    return mediaArray.sort((a, b) => b.likes - a.likes);
};

const sortByTitle = (mediaArray) => {
    return mediaArray.sort((a, b) => a.title.localeCompare(b.title));
};


// Création du conteneur principal du dropdown
const dropdownContainer = document.createElement('div');
dropdownContainer.setAttribute('class', 'dropdown-top');

// Création du bouton principal du dropdown
const mainDropdownButton = document.createElement('button');
mainDropdownButton.setAttribute('class', 'dropbtn');

// Création d'un conteneur div pour le texte "Date"
const dateTextContainer = document.createElement('div');
dateTextContainer.classList.add('date-text-container');

// Création du texte "Date"
const dateText = document.createElement('span');
dateText.innerText = 'Date';

// Ajout du texte "Date" au conteneur
dateTextContainer.appendChild(dateText);

// Ajout du conteneur du texte "Date" au bouton principal
mainDropdownButton.appendChild(dateTextContainer);

// Création de l'élément img pour l'image vectorielle
const arrowImage = document.createElement('img');
arrowImage.src = '/assets/icons/vector.png'; // Utilisez le chemin correct vers votre image PNG
arrowImage.alt = 'Flèche'; // Ajoutez une description alternative pour l'accessibilité
arrowImage.classList.add('arrow-position');


// Ajout de l'image au bouton principal
mainDropdownButton.appendChild(arrowImage);

dropdownContainer.appendChild(mainDropdownButton);

// Création du contenu du dropdown
const dropdownContent = document.createElement('div');
dropdownContent.setAttribute('id', 'myDropdown');
dropdownContent.setAttribute('class', 'dropdown-content dropdown');
dropdownContainer.appendChild(dropdownContent);

// Ajout des options de tri
const options = [
    { text: 'Date', sortFunction: sortByDate },
    { text: 'Popularité', sortFunction: sortByLikes },
    { text: 'Titre', sortFunction: sortByTitle }
];

const updateDropdownContent = (selectedText) => {
    // Vider le contenu actuel
    while (dropdownContent.firstChild) {
        dropdownContent.removeChild(dropdownContent.firstChild);
    }

    // Remplir avec les options non sélectionnées
    options.forEach((option, index) => {
        if (option.text !== selectedText) {
            // Créer la ligne <hr> et ajouter une classe
            const hr = document.createElement('hr');
            hr.classList.add('custom-hr-class'); // Ajouter une classe CSS
            dropdownContent.appendChild(hr);

            const aElement = document.createElement('a');
            aElement.href = '#';
            aElement.innerText = option.text;
            aElement.setAttribute('class', 'link-drop');
            aElement.addEventListener('click', () => {
                mainDropdownButton.querySelector('.date-text-container span').innerText = option.text; // Mettre à jour le texte "Date"
                const sortedMedia = option.sortFunction([...matchingMedia]);
                displayMedia(sortedMedia);
                updateDropdownContent(option.text); // Mettre à jour le contenu du dropdown après avoir changé l'option sélectionnée
            });
            dropdownContent.appendChild(aElement);
        }
    });
};

updateDropdownContent(mainDropdownButton.innerText); // Initialiser avec "Date" comme option sélectionnée par défaut

containerTrier = document.createElement('span');
containerTrier.classList = "container-trier-par";
pTrierPar = document.createElement('p');
pTrierPar.textContent = "Trier Par";
pTrierPar.classList = 'p-trier-par';

// Ajout du dropdown au body

spanTrierPar = document.createElement('span');
spanTrierPar.classList = 'span-trier-par';

spanTrierPar.appendChild(dropdownContainer);
containerTrier.appendChild(pTrierPar);

containerTrier.appendChild(spanTrierPar);
document.body.appendChild(containerTrier);

arrowImage.classList.add('rotate-arrow'); // Supprimez la classe pour la rotation

// Gestion de l'affichage du contenu du dropdown
mainDropdownButton.addEventListener('click', () => {
    const arrowImage = mainDropdownButton.querySelector('img'); // Sélectionnez l'image
    if (dropdownContent.classList.contains('open')) {
        dropdownContent.classList.remove('open');
        arrowImage.classList.add('rotate-arrow'); // Ajoutez la classe pour la rotation lorsque le dropdown se ferme
    } else {
        dropdownContent.classList.add('open');
        arrowImage.classList.remove('rotate-arrow'); // Supprimez la classe pour la rotation lorsque le dropdown s'ouvre
    }
});

// Gestion de la sélection d'un élément du dropdown
dropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        dropdownContent.classList.remove('open'); // Fermez le dropdown lorsque vous cliquez sur un élément
        const arrowImage = mainDropdownButton.querySelector('img'); // Sélectionnez à nouveau l'image
        arrowImage.classList.add('rotate-arrow'); // Ajoutez la classe pour la rotation lorsque le dropdown se ferme
    }
});






// /////////////////////////////////////////

      // Calculate the initial total likes from all media
    const totalLikes = calculateTotalLikes(matchingMedia);

    // Sélectionnez la div .sticky-encart
    const stickyEncart = document.querySelector('.sticky-encart');

    // Créez un élément span pour contenir le nombre de "likes" et l'icône
    const likesAndHeart = document.createElement('span');
    likesAndHeart.setAttribute('id', 'likes-heart');

    // Créez un élément p pour afficher le nombre total de "likes"
    const likesP = document.createElement('p');
    likesP.setAttribute('id', 'likes-p');
    likesP.textContent = totalLikes;

    // Sélectionnez l'icône
    const icon = document.querySelector('.fa-solid');

    // Ajoutez l'icône et le paragraphe à l'élément span
    likesAndHeart.appendChild(icon);
    likesAndHeart.appendChild(likesP);

    // Ajoutez l'élément span à la div .sticky-encart
    stickyEncart.appendChild(likesAndHeart);


    // Display matching media
    if (matchingMedia.length > 0) {
        for (let i = 0; i < matchingMedia.length; i++) {
            const mediaCard = mediaTemplate(matchingMedia[i]).getMediaCardDOM();
            mediaSection.appendChild(mediaCard);
        }
        document.body.appendChild(mediaSection);
    } else {
        console.log("Aucun média trouvé pour l'ID du photographe:", photographerId);
    }
    // Display matching media
if (matchingMedia.length > 0) {
    displayMedia(matchingMedia);
}

}

 

// Appel de la fonction principale
main();

function handleLikeClick(event) {
    // Check if the media has already been liked
    if (event.target.getAttribute('data-liked') === 'true') {
        return; // If already liked, exit the function early
    }

    // Get the current number of likes from the clicked element
    const currentLikes = parseInt(event.target.textContent, 10);
    
    // Increment the number of likes
    const newLikes = currentLikes + 1;
    
    // Update the displayed number of likes
    event.target.textContent = newLikes;

    // Mark the media as liked
    event.target.setAttribute('data-liked', 'true');

    // Update the total likes in the sticky-encart div
    const totalLikesElement = document.querySelector('#likes-p');
    const currentTotalLikes = parseInt(totalLikesElement.textContent, 10);
    totalLikesElement.textContent = (currentTotalLikes + 1);
}



// ********************************************



function openLightbox(index) {
    document.getElementById('lightbox').style.display = 'block';
    showSlides(slideIndex = index);
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function moveSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = mediaItems;
    const lightbox = document.getElementById('lightbox');
    lightbox.setAttribute('aria-label', 'image closup view');
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    const mediaSrc = slides[slideIndex-1];
    const existingImage = document.getElementById('lightboxImage');
    const existingVideo = document.getElementById('lightboxVideo');

    if (mediaSrc.endsWith('.jpg')) {
        // C'est une image
        if (existingVideo) {
            existingVideo.remove();
        }
        if (!existingImage) {
            const lightboxImage = document.createElement('img');
            lightboxImage.className = 'lightbox-content';
            lightboxImage.id = 'lightboxImage';
            lightbox.insertBefore(lightboxImage, lightbox.children[1]);
        }
        document.getElementById('lightboxImage').src = mediaSrc;
    } else if (mediaSrc.endsWith('.mp4')) {
        // C'est une vidéo
        if (existingImage) {
            existingImage.remove();
        }
        if (!existingVideo) {
            const lightboxVideo = document.createElement('video');
            lightboxVideo.className = 'lightbox-content';
            lightboxVideo.id = 'lightboxVideo';
            lightboxVideo.controls = true;
            lightbox.insertBefore(lightboxVideo, lightbox.children[1]);
        }
        document.getElementById('lightboxVideo').src = mediaSrc;
    }
}


