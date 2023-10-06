
function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    const picture = `assets/photographers/${portrait}`;

    // Supprime le .jpg
    let imgAlt = portrait.replace('.jpg', '');

    // Sépare les mots qui commencent par une majuscule, à réviser
    const modifiedString = imgAlt.replace(/([a-z])([A-Z])/g, '$1 $2');

    function getUserCardDOM() {
        const article = document.createElement( 'article' );

        const link = document.createElement('a');
        link.setAttribute("href", "photographer.html?id="+id)
        link.setAttribute('class', 'link-image');

        const containerImg = document.createElement('div');
        containerImg.setAttribute("class", "container-img");

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", modifiedString);
        img.setAttribute("class", "photographer-img");

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        h2.setAttribute("class", "name-style");

        const cityCountry = document.createElement( 'p');
        cityCountry.textContent = city + ", " + country;
        cityCountry.setAttribute('class', 'city-style');

        const taglineP = document.createElement( 'p');
        taglineP.textContent = tagline;
        taglineP.setAttribute("class", "tagline-style");

        const priceP = document.createElement( 'p' );
        priceP.textContent = price + "€ /jour";
        priceP.setAttribute("class", "price-style");

        containerImg.appendChild(img);
        link.appendChild(containerImg); 
        link.appendChild(h2);
        article.appendChild(link);
        article.appendChild(cityCountry);
        article.appendChild(taglineP);
        article.appendChild(priceP);
        
        return (article);
    }
    return { name, picture, getUserCardDOM }
}