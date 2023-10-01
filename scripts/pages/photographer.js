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


