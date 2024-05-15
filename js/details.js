//authorization credentials
let publicKey = "e9fa90efe37bf432141d6462c81af9d5";
let privateKey = "cf41d7ba4741480cbd532b57ede3b9e5fb86be3e";
let ts = new Date().getTime();
let hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
let contentBox = document.getElementsByClassName("content-box")[0];

document.addEventListener("DOMContentLoaded", () => {
  contentBox.style.visibility = "hidden";

  //adding event listerner to favourites button
  document.getElementById("addToFavourites").addEventListener("click", () => {
    location.href = "favourites.html";
  });

  //console.log(location.href.split("?")[1].split("=")[1]);
  let characterID = location.href.split("?")[1].split("=")[1];
  getSuperHerosByID(characterID);
});

async function getSuperHerosByID(characterId) {
  try {
    const response = await fetch(
      `http://gateway.marvel.com//v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    if (!response.ok) {
      throw new Error("Network response was not okay.");
    }
    const data = await response.json();
    //console.log(data);
    populateDetails(data.data.results[0]);
  } catch (error) {
    console.error(error);
  }
}

function populateDetails(data) {
  document
    .getElementById("hero-image")
    .setAttribute("src", data.thumbnail.path + "." + data.thumbnail.extension);
  document.getElementById("superhero-name").textContent = data.name;
  if (data.description != "") {
    document.getElementById("superhero-description").textContent =
      data.description;
  } else {
    document.getElementById("description").remove();
  }
  document.getElementById("comics-count").textContent = data.comics.available;
  document.getElementById("events-count").textContent = data.events.available;
  document.getElementById("series-count").textContent = data.series.available;
  document.getElementById("stories-count").textContent = data.stories.available;
  contentBox.style.visibility = "visible";
}
