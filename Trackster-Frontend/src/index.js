let currentUser = null;
let playlistCollapseEl = document.getElementById("playlistCollapse");

const formEl = document.querySelector("form");
formEl.addEventListener("submit", e => {
  e.preventDefault();
  searchResult(e.target.elements.name.value);
});

//show/hide search
let searchShow = false;

document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("searchToggle");
  const searchDiv = document.getElementById("searchDiv");
  searchToggle.addEventListener("click", () => {
    searchShow = !searchShow;
    if (searchShow) {
      searchDiv.className = "searchShow";
    } else {
      searchDiv.className = "searchHidden";
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems);
});

const createModal = () => {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
};
document.addEventListener("DOMContentLoaded", function() {
  createModal();
});

//handle results
const renderResults = fetchedResults => {
  const resultsList = document.getElementById("resultsAccordion");
  resultsList.innerHTML = "";

  fetchedResults.forEach(result => renderResult(result, resultsList));

  createModal();
};

//render each result into a list
const renderResult = (result, resultsList) => {
  const resultItem = document.createElement("li");

  const itemHeader = document.createElement("div");
  itemHeader.className = "collapsible-header";
  const headerContent = `${result.title} - ${result.artist.name}, Album: ${result.album.title}`;

  const headerIcon = document.createElement("i");
  headerIcon.className = "material-icons";

  const headerImage = document.createElement("img");
  headerImage.className = "responsive-img circle ";
  headerImage.src = result.album.cover_small;

  itemHeader.append(headerIcon, headerImage, headerContent);

  const itemBody = document.createElement("div");
  itemBody.className = "collapsible-body";

  const bodySpan = document.createElement("span");

  //modal
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal";
  modalDiv.id = `modal${result.id}`;

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalContentHeader = document.createElement("h4");
  modalContentHeader.innerText = "Select playlist to add the song to";

  const addToPlaylistModal = document.createElement("a");
  addToPlaylistModal.className =
    "waves-effect waves-light btn green modal-trigger";

  addToPlaylistModal.setAttribute("href", `#modal${result.id}`);

  const bodyIcon = document.createElement("i");
  bodyIcon.className = "material-icons large";
  bodyIcon.innerText = "playlist_add";
  addToPlaylistModal.append(bodyIcon);

  const audioPreview = document.createElement("audio");
  audioPreview.setAttribute("controls", "controls");
  audioPreview.setAttribute("src", `${result.preview}`);
  audioPreview.setAttribute("type", "audio/mpeg");

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  bodySpan.append(audioPreview, addToPlaylistModal);
  modalContent.append(modalContentHeader);
  modalDiv.append(modalContent);
  modalDiv.append(modalFooter);
  bodySpan.append(modalDiv);
  itemBody.append(bodySpan);

  resultItem.append(itemHeader, itemBody);
  resultsList.append(resultItem);
};

//search
const searchResult = value => {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${value}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "d0e26413acmsh8b0c66313f1ff6cp14b3c7jsn84dd8c7ba916"
    }
  })
    .then(response => response.json())
    .then(results => {
      renderResults(results.data);
    })
    .catch(err => {
      console.log(err);
    });
};

// login form
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  getUsername(e.target.elements.username.value).then(user => {
    if (user) {
      currentUser = user;
      iteratePlaylists(user);
      loginForm.innerHTML = "";
    }
  });
});

const getUsername = username => {
  return fetch(`http://localhost:3000/users/${username}`, {
    method: "GET"
  }).then(resp => resp.json());
};
