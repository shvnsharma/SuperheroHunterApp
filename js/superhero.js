//authorization credentials
let publicKey = "e9fa90efe37bf432141d6462c81af9d5";
let privateKey = "cf41d7ba4741480cbd532b57ede3b9e5fb86be3e";
let ts = new Date().getTime();
let hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
//console.log(hash);

// variables
let superHeroList = [];
let searchTagElement = document.getElementsByClassName("form-control")[0];
let contentTag = document.getElementsByClassName("contents")[0];
let alertTag = document.getElementsByClassName("alert-style")[0];

//adding event listerner to favourites button
document.getElementById("addToFavourites").addEventListener("click", () => {
  location.href = "favourites.html";
});

// take input from the search bar
searchTagElement.addEventListener("keyup", (event) => {
  // console.log(searchTagElement.value);
  if (searchTagElement.value === "") {
    contentTag.innerHTML = "";
    //console.log("No input provided");
  } else {
    getSuperHerosByText(searchTagElement.value);
  }
});

//based on the input get results from the api
async function getSuperHerosByText(searchText) {
  try {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchText}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    if (!response.ok) {
      throw new Error("Network response was not okay.");
    }
    const data = await response.json();
    //console.log(data);
    createHTMLData(data);
  } catch (error) {
    console.error(error);
  }
}

//create html tags to create cards from the results fetched
function createHTMLData(response) {
  contentTag.innerHTML = "";
  // console.log(contentTag);
  // console.log(response.data.results);
  let arr = response.data.results;
  if (arr.length == 0) {
    console.log("No results found");
    let h2Tag = document.createElement("h2");
    h2Tag.textContent = "No results found";
    h2Tag.classList.add("no-results");
    contentTag.appendChild(h2Tag);
  }
  for (const iterator of arr) {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "card-style");

    let img = document.createElement("img");
    //console.log(iterator);
    img.setAttribute(
      "src",
      iterator.thumbnail.path + "." + iterator.thumbnail.extension
    );
    img.classList.add("card-img-top", "img-style");

    let cardBody = document.createElement("div");

    let cardName = document.createElement("h5");
    cardName.classList.add("card-title");
    cardName.textContent = iterator.name;

    let detailsBtn = document.createElement("a");
    detailsBtn.classList.add("btn", "btn-primary", "anchor-style");
    detailsBtn.setAttribute("href", `details.html?id=${iterator.id}`);
    detailsBtn.textContent = "Details";

    let favBtn = document.createElement("a");
    favBtn.classList.add("btn", "btn-primary", "anchor-style");
    favBtn.setAttribute("href", "#");
    favBtn.setAttribute("characterID", `${iterator.id}`);
    favBtn.textContent = "Add to favourites";
    favBtn.addEventListener("click", (event) => {
      addToFavourites(event);
    });

    cardBody.append(cardName, detailsBtn, favBtn);
    cardDiv.append(img, cardBody);

    contentTag.appendChild(cardDiv);

    // <div class="card" style="width: 18rem;">
    //                   <img src="" class="card-img-top" alt="">
    //                   <div class="card-body">
    //                       <h5 class="card-title">Card title</h5>
    //                       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
    //                           content.</p>
    //                       <a href="#" class="btn btn-primary">Details</a>
    //                       <a href="#" class="btn btn-primary">Add to Favourites</a>
    //                   </div>
    //               </div>
  }
}

async function addToFavourites(event) {
  // console.log(event.target);
  // console.log(event.target.getAttribute("characterID"));
  let characterId = event.target.getAttribute("characterID");
  if (!checkForDuplicates(characterId)) {
    try {
      const response = await fetch(
        `https://gateway.marvel.com//v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
      );
      if (!response.ok) {
        throw new Error("Network response was not okay.");
      }
      const data = await response.json();
      // console.log(data);
      saveToLocalStorage(data.data.results[0]);

      showAlertForSuccess();
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("duplicate selection");
    showAlertForDuplicate();
  }
}

//adding fade out feature
function showAlertForSuccess() {
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Added to favourites successfully !</strong>
        </div>
    `;

  // Append the alert to the container
  alertContainer.innerHTML = alertMessage;

  // Use setTimeout to fade out the alert after 3 seconds (3000 ms)
  setTimeout(() => {
    const alertElement = alertContainer.querySelector(".alert");
    // console.log(alertElement);
    if (alertElement) {
      alertElement.style.display = "none";
    }
  }, 2500);
}

function showAlertForDuplicate() {
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Already added to favourites !</strong>
        </div>
    `;

  // Append the alert to the container
  alertContainer.innerHTML = alertMessage;

  // Use setTimeout to fade out the alert after 3 seconds (3000 ms)
  setTimeout(() => {
    const alertElement = alertContainer.querySelector(".alert");
    //console.log(alertElement);
    if (alertElement) {
      alertElement.style.display = "none";
    }
  }, 2500);
}

function saveToLocalStorage(data) {
  let arr;
  if (localStorage.getItem("favourites") == null) {
    arr = [];
    arr.push(data);
  } else {
    let str = localStorage.getItem("favourites");
    arr = JSON.parse(str);
    //console.log("previous arr: " + arr);
    arr.push(data);
  }
  //console.log("After pushing: " + arr.toString());
  let newStr = JSON.stringify(arr);
  localStorage.setItem("favourites", newStr);
}

function checkForDuplicates(characterID) {
  let str = localStorage.getItem("favourites");
  let arr = JSON.parse(str);
  //console.log("inside check for duplicates: " + arr);
  for (const iterator of arr) {
    //console.log(iterator.id);
    if (iterator.id == characterID) {
      return true;
    }
  }
  return false;
}
