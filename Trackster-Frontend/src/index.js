let currentUser = null;

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

const addEffects = () => {
  const elems = document.querySelectorAll(".collapsible");
  const instances = M.Collapsible.init(elems);
};
document.addEventListener("DOMContentLoaded", () => {
  addEffects();
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
let playlistCollapseEl = document.getElementById("playlistCollapse");
// let trackCollapseEl = document.getElementById("trackCollapse");

const showPlaylist = playlist => {
  let trackCollapseEl = document.createElement("ul");
  let playlistEl = document.createElement("li");
  let playlistHeaderEl = document.createElement("div");
  playlistHeaderEl.className = "collapsible-header";
  playlistHeaderEl.innerText = playlist.name;
  let playlistIconEl = document.createElement("i");
  playlistIconEl.className = "material-icons";
  let playlistBodyEl = document.createElement("div");
  playlistBodyEl.className = "collapsible-body";
  playlistCollapseEl.append(playlistEl);
  playlistEl.append(playlistHeaderEl, playlistBodyEl);
  playlistHeaderEl.append(playlistIconEl);
  playlistBodyEl.append(trackCollapseEl);
  playlist.tracks.forEach(track => createTracks(track, trackCollapseEl));
};

const createTracks = (track, trackCollapseEl) => {
  trackCollapseEl.className = "collapsible popout";
  let trackEl = document.createElement("li");
  let trackHeaderEl = document.createElement("div");
  trackHeaderEl.className = "collapsible-header";
  trackHeaderEl.innerText = track.title;
  let trackBodyEl = document.createElement("div");
  trackBodyEl.className = "collapsible-body";
  trackCollapseEl.append(trackEl);
  trackEl.append(trackHeaderEl, trackBodyEl);
  fetchTrackInfo(track, trackBodyEl);
};

const fetchTrackInfo = (track, trackBodyEl) => {
  return fetch(
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
      renderTrackInfo(trackInfo, trackBodyEl);
    })
    .catch(err => {
      console.log(err);
    });
};

const renderTrackInfo = (track, trackBodyEl) => {
  let trackTitleEl = document.createElement("h1");
  trackTitleEl.innerText = track.title;
  let trackArtistEl = document.createElement("h2");
  trackArtistEl.innerText = track.artist.name;
  let trackAlbumEl = document.createElement("h2");
  trackAlbumEl.innerText = track.album.title;
  let trackAlbumImageEl = document.createElement("img");
  trackAlbumImageEl.src = track.album.cover_medium;
  trackBodyEl.append(
    trackTitleEl,
    trackArtistEl,
    trackAlbumEl,
    trackAlbumImageEl
  );
  addEffects();
};

const getUsername = username => {
  return fetch(`http://localhost:3000/users/${username}`, {
    method: "GET"
  }).then(resp => resp.json());
};
