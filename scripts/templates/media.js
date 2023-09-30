const mediaSection = document.createElement('div');
mediaSection.setAttribute("id", "media-section");
document.body.appendChild(mediaSection);

function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;
    
    const section = document.querySelector('.photograph-header');
    const contact = document.querySelector('#contactMe');
    contact.innerHTML = "Contactez-Moi <br>" + name;

    

    const divImage = document.createElement('div');
    divImage.setAttribute('class', 'imagePh-style');

    const divInfos = document.createElement('div');
    divInfos.setAttribute('class', 'infos-style');

    const nameElement = document.createElement('h2');
    nameElement.textContent = name;
    divInfos.appendChild(nameElement);

    const portraitElement = document.createElement('img');
    portraitElement.setAttribute("src", `assets/photographers/${portrait}`);
    portraitElement.setAttribute("alt", name);
    portraitElement.setAttribute("class", "portrait-size");
    divImage.appendChild(portraitElement);

    const countryCityElement = document.createElement('p');
    countryCityElement.textContent = city + ", " + country;
    divInfos.appendChild(countryCityElement);

    const taglineElement = document.createElement('p');
    taglineElement.textContent = tagline;
    divInfos.appendChild(taglineElement);

    

    section.insertBefore(divInfos, section.firstChild);
    section.appendChild(divImage);
    
    return section;
}


function mediaTemplate(data, index) {
    const { name, image, title, likes, video} = data;

    const namePhotograph = document.createElement('h2');
    namePhotograph.textContent = name;
    
    const picture = image ? `assets/images/${image}` : null;
    const videoMedia = video ? `assets/images/${video}` : null;

    let mediaAlt, mediaElement;
    

    if (picture) {

        mediaAlt = picture.replace('.jpg', '').replace(/([a-z])([A-Z])/g, '$1 $2');
        mediaElement = document.createElement('img');
        // Attach the click event to the media element
        mediaElement.addEventListener('click', () => openLightbox(index));

        mediaElement.setAttribute("src", picture);
        mediaElement.setAttribute("onclick", `openLightbox(${mediaItems.length})`);
        mediaItems.push(picture);

        mediaElement.setAttribute("alt", mediaAlt);
        mediaElement.setAttribute("class", "media-size");
       

    } else if (videoMedia) {

        mediaAlt = videoMedia.replace('.mp4', '').replace(/([a-z])([A-Z])/g, '$1 $2');
        mediaElement = document.createElement('video');
        const source = document.createElement('source');
        source.setAttribute("src", videoMedia);
        // Attach the click event to the media element
        mediaElement.addEventListener('click', () => openLightbox(index));

        mediaElement.setAttribute("onclick", `openLightbox(${mediaItems.length})`);
        mediaItems.push(videoMedia);

        source.setAttribute("type", "video/mp4");
        mediaElement.appendChild(source);
        mediaElement.setAttribute("alt", mediaAlt);
        mediaElement.setAttribute("controls", "true");
        mediaElement.setAttribute("class", "media-size");
        

    }

    function getMediaCardDOM() {
        const article = document.createElement('article');
        article.setAttribute("class", "media-style");

        const titleLikes = document.createElement('div');
        titleLikes.setAttribute('class', 'title-like');

        const mediaTitle = document.createElement('h3');
        mediaTitle.textContent = title;

        const mediaLikes = document.createElement('p');
        mediaLikes.textContent = likes;
        mediaLikes.setAttribute('class', 'like-counter');
        mediaLikes.setAttribute('data-liked', 'false');  // Initialize the data-liked attribute

        

        article.appendChild(mediaElement);
        article.appendChild(titleLikes);

        titleLikes.appendChild(mediaTitle);
        titleLikes.appendChild(mediaLikes);


        return article;
    }

    return { getMediaCardDOM};
}



