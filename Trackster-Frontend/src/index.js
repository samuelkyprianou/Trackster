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


//handle results
const renderResults = fetchedResults => {
  const resultsDiv = document.querySelector(".results");
  resultsDiv.innerHTML = "";
  const resultsList = document.createElement("div");
  resultsList.className = "accordion";
  resultsList.id = "accordionParent";

  resultsDiv.append(resultsList);

  fetchedResults.forEach(result => renderResult(result, resultsList));
};

//render each result into a list

const renderResult = (result, resultsList) => {
  const resultItem = document.createElement("div");
  resultItem.className = "card";

  const resultHeader = document.createElement("div");
  resultHeader.className = "card-header";
  resultHeader.id = `cons${result.id}`;

  const resultTitle = document.createElement("h2");
  resultTitle.className = "mb-0";

  const titleButton = document.createElement("button");
  titleButton.className = "btn btn-link";
  titleButton.setAttribute("type", "button");
  titleButton.setAttribute("data-toggle", "collapse");
  titleButton.setAttribute("data-target", `#heading${result.id}`);
  titleButton.setAttribute("aria-expanded", "false");
  titleButton.setAttribute("aria-controls", `heading${result.id}`);
  titleButton.innerText = `${result.title} - ${result.artist.name}, Album: ${result.album.title}`;

  resultTitle.append(titleButton);
  resultHeader.append(resultTitle);
  resultItem.append(resultHeader);
  resultsList.append(resultItem);

  const innerCollapse = document.createElement("div");
  innerCollapse.id = `heading${result.id}`;
  innerCollapse.className = "collapse";
  innerCollapse.setAttribute("aria-labelledby", `cons${result.id}`);
  innerCollapse.setAttribute("data-parent", "#accordionParent");

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const audioPreview = document.createElement("audio");
  audioPreview.setAttribute("controls", "controls");
  audioPreview.setAttribute("src", `${result.preview}`);
  audioPreview.setAttribute("type", "audio/mpeg");
  cardBody.append(audioPreview);

  const addToPlaylist = document.createElement("img");
  addToPlaylist.className = "playlistIcon";
  addToPlaylist.src = "images/addToPlaylist.png";

  cardBody.append(audioPreview);
  cardBody.append(addToPlaylist);
  innerCollapse.append(cardBody);

  resultsList.append(innerCollapse);
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

//login form
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

const iteratePlaylists = user =>
  user.data.playlist.forEach(playlist => showPlaylist(playlist));

const showPlaylist = playlist => {
  playlistCollapseEl.innerText = "";
  let cardEl = document.createElement("div");
  cardEl.className = "card";
  let cardHeaderEl = document.createElement("div");
  cardHeaderEl.className = "card-header";
  cardHeaderEl.setAttribute("id", playlist.id);
  let h2El = document.createElement("h2");
  h2El.className = "mb-0";
  let buttonEl = document.createElement("button");
  buttonEl.className = "btn btn-link";
  buttonEl.type = "button";
  buttonEl.setAttribute("data-toggle", "collapse");
  buttonEl.setAttribute("data-target", `#${playlist.name}`);
  buttonEl.setAttribute("aria-expanded", "false");
  buttonEl.setAttribute("aria-controls", playlist.name);
  buttonEl.innerText = playlist.name;
  let trackDivEl = document.createElement("div");
  trackDivEl.setAttribute("id", playlist.name);
  trackDivEl.className = "collapse";
  trackDivEl.setAttribute("aria-labelledby", playlist.name);
  trackDivEl.setAttribute("data-parent", "#playlistCollapse");
  let trackCardEl = document.createElement("div");
  trackCardEl.className = "card-body";
  playlistCollapseEl.append(cardEl);
  cardEl.append(cardHeaderEl, trackDivEl);
  cardHeaderEl.append(h2El);
  h2El.append(buttonEl);
  trackDivEl.append(trackCardEl);
  let trackCardDivEl = document.createElement("div");
  trackCardDivEl.className = "list-group";
  trackCardEl.append(trackCardDivEl);
  playlist.tracks.forEach(track => createTracks(track, trackCardDivEl));
};

const createTracks = (track, trackCardDivEl) => {
  let trackButtonEl = document.createElement("button");
  let trackInfoDiv = document.createElement("div");
  trackButtonEl.addEventListener("click", () => {
    fetchTrackInfo(track, trackInfoDiv);
  });
  trackButtonEl.className = "list-group-item list-group-item-action";
  trackButtonEl.innerText = track.title;
  trackCardDivEl.append(trackButtonEl);
  trackButtonEl.append(trackInfoDiv);
};

const fetchTrackInfo = (track, trackInfoDiv) => {
  fetch(
    `https://deezerdevs-deezer.p.rapidapi.com/track/${track.deezer_track_id}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "d0e26413acmsh8b0c66313f1ff6cp14b3c7jsn84dd8c7ba916"
      }
    }
  )
    .then(response => response.json())
    .then(trackInfo => {
      renderTrackInfo(trackInfo, trackInfoDiv);
    })
    .catch(err => {
      console.log(err);
    });
};

const renderTrackInfo = (track, trackInfoDiv) => {
  trackInfoDiv.innerHTML = "";
  trackInfoDiv.setAttribute("id", track.id);
  let trackTitleEl = document.createElement("h1");
  trackTitleEl.innerText = track.title;
  let trackArtistEl = document.createElement("h2");
  trackArtistEl.innerText = track.artist.name;
  let trackAlbumEl = document.createElement("h2");
  trackAlbumEl.innerText = track.album.title;
  let trackAlbumImageEl = document.createElement("img");
  trackAlbumImageEl.src = track.album.cover_medium;
  trackInfoDiv.append(
    trackTitleEl,
    trackArtistEl,
    trackAlbumEl,
    trackAlbumImageEl
  );
};

const getUsername = username => {
  return fetch(`http://localhost:3000/users/${username}`, {
    method: "GET"
  }).then(resp => resp.json());
};
