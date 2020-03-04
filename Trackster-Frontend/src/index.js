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

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, {
    outDuration: 0
  });
});

const createModal = () => {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
};
document.addEventListener("DOMContentLoaded", function() {
  createModal();
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

//create playlist

const createPlaylistForm = document.getElementById("createplaylist");
createPlaylistForm.addEventListener("submit", e => {
  e.preventDefault();
  postPlaylist({
    name: e.target.elements.name.value,
    user_id: currentUser.data.id
  }).then(() => e.target.reset());
});

const postPlaylist = playlistObj => {
  return fetch("http://localhost:3000/playlists", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(playlistObj)
  })
    .then(res => res.json())
    .then(playlist => {
      showPlaylist(playlist);
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
