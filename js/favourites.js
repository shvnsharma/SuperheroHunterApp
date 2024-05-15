let contentTag = document.getElementsByClassName("contents")[0];
let arr;

document.addEventListener("DOMContentLoaded", getFavouriteListFromLocalStorage);

function getFavouriteListFromLocalStorage() {
  console.log(location.href);
  console.log(localStorage.getItem("favourites"));
  contentTag.innerHTML = "";

  if (JSON.parse(localStorage.getItem("favourites")).length == 0) {
    console.log("No results found");
    let h2Tag = document.createElement("h2");
    h2Tag.textContent = "Don't have favourites yet! Add them now... ";
    h2Tag.classList.add("no-results");
    contentTag.appendChild(h2Tag);
  } else {
    let str = localStorage.getItem("favourites");
    arr = JSON.parse(str);
    //console.log(arr);
    addFavouriteCards(arr);
  }
}

function addFavouriteCards(arr) {
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

    let removeBtn = document.createElement("a");
    removeBtn.classList.add("btn", "btn-danger", "anchor-style");
    removeBtn.setAttribute("href", "#");

    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeFromFavourites(iterator);
    });

    cardBody.append(cardName, removeBtn);
    cardDiv.append(img, cardBody);

    contentTag.appendChild(cardDiv);

    //    <div class="card" style="width: 18rem">
    //      <img src="" class="card-img-top" alt="" />
    //      <div class="card-body">
    //        <h5 class="card-title">Card title</h5>
    //        <a href="#" class="btn btn-danger" id="remove">
    //          Remove
    //        </a>
    //      </div>
    //    </div>;
  }
}

function removeFromFavourites(element) {
  let newArr = arr.filter((a) => {
    return a.id != element.id;
  });
  //console.log(newArr);
  let jsonArr = JSON.stringify(newArr);
  localStorage.setItem("favourites", jsonArr);
  showAlert();
}

function showAlert() {
  const alertContainer = document.getElementById("alert-container-fav");
  const alertMessage = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Removed from favourites successfully !</strong>
        </div>
    `;

  // Append the alert to the container
  alertContainer.innerHTML = alertMessage;
  const alertElement = alertContainer.querySelector(".alert");

  //Use setTimeout to fade out the alert after 3 seconds (3000 ms)
  setTimeout(() => {
    const alertElement = alertContainer.querySelector(".alert");
    //console.log(alertElement);
    if (alertElement) {
      alertElement.style.display = "none";
      setTimeout(getFavouriteListFromLocalStorage, 500);
    }
  }, 2000);
}
