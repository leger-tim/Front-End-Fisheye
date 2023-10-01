const urlParams = new URLSearchParams(window.location.search);
const photographerId = parseInt(urlParams.get('id')); // Assurez-vous que l'ID est converti en nombre entier


let slideIndex = 1;
const mediaItems = [];


// Sort by date
const sortByDate = (mediaArray) => {
    return mediaArray.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Sort by likes
const sortByLikes = (mediaArray) => {
    return mediaArray.sort((a, b) => b.likes - a.likes);
}

// Sort by title
const sortByTitle = (mediaArray) => {
    return mediaArray.sort((a, b) => a.title.localeCompare(b.title));
}

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



     // Add sorting buttons
     const sortDateButton = document.createElement('button');

     sortDateButton.innerText = 'Date';
     sortDateButton.addEventListener('click', () => {
         const sortedMedia = sortByDate([...matchingMedia]);
         displayMedia(sortedMedia);
     });
 
     const sortLikesButton = document.createElement('button');
 
     sortLikesButton.innerText = 'Popularité';
     sortLikesButton.addEventListener('click', () => {
         const sortedMedia = sortByLikes([...matchingMedia]);
         displayMedia(sortedMedia);
     });
 
     const sortTitleButton = document.createElement('button');
 
         sortTitleButton.innerText = 'Titre';
         sortTitleButton.addEventListener('click', () => {
         const sortedMedia = sortByTitle([...matchingMedia]);
         displayMedia(sortedMedia);
     });
 

    /////////////////////////////////////////////////////////////////



     const trierAndButtonContainer = document.createElement('span');
     trierAndButtonContainer.setAttribute('id', 'trier-and-button');
     const trier = document.createElement('p');
     trier.setAttribute('id', 'trier-p');
     trier.textContent = 'Trier Par';
     trierAndButtonContainer.appendChild(trier);

    const dropdownContainer = document.createElement('div');
dropdownContainer.style.position = 'relative';

const visibleButton = document.createElement('button');
visibleButton.innerText = 'Date'; // Default value
visibleButton.addEventListener('click', () => {
    if (visibleButton.innerText === 'Date') {
        const sortedMedia = sortByDate([...matchingMedia]);
        displayMedia(sortedMedia);
    } else if (visibleButton.innerText === 'Popularité') {
        const sortedMedia = sortByLikes([...matchingMedia]);
        displayMedia(sortedMedia);
    } else if (visibleButton.innerText === 'Titre') {
        const sortedMedia = sortByTitle([...matchingMedia]);
        displayMedia(sortedMedia);
    }
});
dropdownContainer.appendChild(visibleButton);

const dropdown = document.createElement('div');
dropdown.style.display = 'none';
dropdown.style.position = 'absolute';
dropdown.style.top = '100%';
dropdown.style.zIndex = '1';

const allButtons = [sortDateButton, sortLikesButton, sortTitleButton];

function rebuildDropdown() {
    // Clear the dropdown
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    // Append buttons to the dropdown if their text is different from the visibleButton's text
    allButtons.forEach(button => {
        if (button.innerText !== visibleButton.innerText) {
            dropdown.appendChild(button);
        }
    });
}

allButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update the visibleButton's text
        visibleButton.innerText = button.innerText;
        dropdown.style.display = 'none';

        // Rebuild the dropdown
        rebuildDropdown();
    });
});

// Initially build the dropdown
rebuildDropdown();

dropdownContainer.appendChild(dropdown);

dropdownContainer.addEventListener('mouseover', () => {
    dropdown.style.display = 'block';
});
dropdownContainer.addEventListener('mouseout', () => {
    dropdown.style.display = 'none';
});

// document.body.appendChild(dropdownContainer);
document.body.appendChild(trierAndButtonContainer);
trierAndButtonContainer.appendChild(dropdownContainer);

   

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



let currentMediaIndex = 0;
// Only get images and videos within the section with id 'target-section'
const targetSection = document.getElementById('media-section');
const mediaArray = targetSection.querySelectorAll('article img, article video');
console.log(mediaArray)

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxVideo = document.getElementById('lightboxVideo');

console.log("Total media elements:", mediaArray.length);


function openLightbox(index) {
    currentMediaIndex = index;
    if (index < 0 || index >= mediaArray.length) {
        console.error("Invalid index:", index);
        return;
    }

    if (mediaArray[index].tagName === 'IMG') {
        lightboxImage.src = mediaArray[index].src;
        lightboxImage.style.display = 'block';
        lightboxVideo.style.display = 'none';
    } else {
        lightboxVideo.src = mediaArray[index].src;
        lightboxVideo.style.display = 'block';
        lightboxImage.style.display = 'none';
    }

    lightbox.style.display = 'block';
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

function move(direction) {
    currentMediaIndex += direction;
    if (currentMediaIndex < 0) {
        currentMediaIndex = mediaArray.length - 1;
    } else if (currentMediaIndex >= mediaArray.length) {
        currentMediaIndex = 0;
    }
    openLightbox(currentMediaIndex);
}

// Attach click event to all media
mediaArray.forEach((media, index) => {
    media.addEventListener('click', () => openLightbox(index));
});

