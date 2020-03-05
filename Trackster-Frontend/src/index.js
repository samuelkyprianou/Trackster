let currentUser = null;
const reducer = (accumulator, currentValue) => accumulator + currentValue;

const formEl = document.querySelector("form");
formEl.addEventListener("submit", e => {
  e.preventDefault();
  searchResult(e.target.elements.name.value);
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

//modal select initialize

const addModalSelect = () => {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
};
document.addEventListener("DOMContentLoaded", function() {
  addModalSelect();
});

//handle results
const renderResults = fetchedResults => {
  const resultsList = document.getElementById("resultsAccordion");
  resultsList.innerHTML = "";
  const searchHeader = document.createElement("h2");
  resultsList.append(searchHeader);

  fetchedResults.forEach(result => renderResult(result, resultsList));

  createModal();
  addModalSelect();
};

//post track to playlist

//render each result into a list
const renderResult = (result, resultsList) => {
  const resultItem = document.createElement("li");

  const itemHeader = document.createElement("div");
  itemHeader.className = "collapsible-header card-panel hoverable";
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

  const modalForm = document.createElement("form");
  modalForm.id = "playlistSelect";
  modalForm.addEventListener("submit", e => {
    const playlistId = modalSelect.options[modalSelect.selectedIndex].value;
    e.preventDefault();
    postTrack(
      {
        title: result.title,
        duration: result.duration,
        artist: result.artist.name,
        cover_small: result.album.cover_small,
        album_title: result.album.title,
        preview: result.preview,
        deezer_track_id: result.id,
        deezer_album_id: result.album.id,
        deezer_artist_id: result.artist.id
      },
      playlistId
    );
    console.log(playlistId);
  });

  const postTrack = (trackObj, playlistId) => {
    fetch("http://localhost:3000/tracks", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(trackObj)
    })
      .then(resp => resp.json())
      .then(track => postTrackToTrackPlaylist(track, playlistId));
  };

  const postTrackToTrackPlaylist = (track, playlistId) => {
    fetch("http://localhost:3000/track_playlists", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ track_id: track.id, playlist_id: playlistId })
    })
      .then(resp => resp.json())
      .then(playlistObj => {
        const tracksEl = document.getElementById(`playlist${playlistId}`);
        createTracks(track, tracksEl);
      });
  };
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal";
  modalDiv.id = `modal${result.id}`;

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalContentHeader = document.createElement("h4");
  modalContentHeader.innerText = "Select the playlist";

  //select
  const modalSelectDiv = document.createElement("div");
  modalSelectDiv.className = "input-field col s12";

  const renderPlaylist = playlist => {
    const playlistOption = document.createElement("option");
    playlistOption.setAttribute("value", playlist.id);
    playlistOption.innerText = playlist.name;

    modalSelect.append(playlistOption);
  };

  const modalSelect = document.createElement("select");
  modalSelect.id = "playlistDropdown";
  const firstOption = document.createElement("option");
  firstOption.setAttribute("selected", "true");
  firstOption.setAttribute("disabled", "disabled");
  firstOption.innerText = "Choose playlist";
  modalSelect.append(firstOption);

  currentUser.data.playlist.forEach(playlist => renderPlaylist(playlist));

  modalSelectDiv.append(modalSelect);

  const addToPlaylistModal = document.createElement("a");
  addToPlaylistModal.className =
    "waves-effect waves-light btn green modal-trigger";

  addToPlaylistModal.setAttribute("href", `#modal${result.id}`);

  const bodyIcon = document.createElement("i");
  bodyIcon.className = "large material-icons ";
  bodyIcon.innerText = "playlist_add";
  addToPlaylistModal.append(bodyIcon);

  const audioPreview = document.createElement("audio");
  audioPreview.setAttribute("controls", "controls");
  audioPreview.setAttribute("src", `${result.preview}`);
  audioPreview.setAttribute("type", "audio/mpeg");

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const footerSave = document.createElement("button");
  footerSave.innerText = "Save";
  footerSave.setAttribute("type", "submit");
  footerSave.className = "modal-close waves-effect green btn-flat";

  modalFooter.append(footerSave);
  bodySpan.append(audioPreview, addToPlaylistModal);
  modalForm.append(modalSelectDiv, modalContent, modalFooter);
  modalContent.append(modalContentHeader, modalSelectDiv);
  modalDiv.append(modalForm);

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
    .then(playlistObj => {
      currentUser.data.playlist = [
        ...currentUser.data.playlist,
        playlistObj.data
      ];
      showPlaylist(playlistObj.data);
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
  trackCollapseEl.id = `playlist${playlist.id}`;
  let playlistEl = document.createElement("li");
  let playlistHeaderEl = document.createElement("div");
  playlistHeaderEl.className = "collapsible-header card-panel hoverable";
  playlistHeaderEl.innerText = playlist.name;
  let durationSpanEl = document.createElement("span");
  durationSpanEl.setAttribute("style", "float:right");
  let durationTotal = playlist.tracks.map(track => track.duration);
  durationTotal.length
    ? (durationSpanEl.innerText =
        "Duration: " + (durationTotal.reduce(reducer) / 60).toFixed(2))
    : (durationSpanEl.innerText = "Playlist Empty");
  let playlistIconEl = document.createElement("i");
  playlistIconEl.className = "material-icons";
  let playlistBodyEl = document.createElement("div");
  playlistBodyEl.className = "collapsible-body";
  playlistCollapseEl.append(playlistEl);
  playlistEl.append(playlistHeaderEl, playlistBodyEl);
  playlistHeaderEl.append(playlistIconEl, durationSpanEl);
  playlistBodyEl.append(trackCollapseEl);
  playlist.tracks.forEach(track => createTracks(track, trackCollapseEl));
};

const createTracks = (track, trackCollapseEl) => {
  trackCollapseEl.className = "collapsible popout";
  let trackPicEl = document.createElement("img");
  trackPicEl.className = "responsive-img circle";
  trackPicEl.src = track.cover_small;
  let trackEl = document.createElement("li");
  let trackHeaderEl = document.createElement("div");
  trackHeaderEl.className = "collapsible-header";
  let h3TitleEl = document.createElement("h7");
  h3TitleEl.innerText = track.title;
  let trackBodyEl = document.createElement("div");
  trackBodyEl.className = "collapsible-body";
  trackCollapseEl.append(trackEl);
  trackEl.append(trackHeaderEl, trackBodyEl);
  trackHeaderEl.append(h3TitleEl, trackPicEl);
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
  let trackAudioEl = document.createElement("audio");
  trackAudioEl.setAttribute("controls", "controls");
  trackAudioEl.src = track.preview;
  trackAudioEl.setAttribute("type", "audio/mpeg");
  let trackTitleEl = document.createElement("h2");

  trackTitleEl.innerText = track.title;
  let trackArtistEl = document.createElement("h4");
  trackArtistEl.innerText = track.artist.name;
  let trackAlbumEl = document.createElement("h4");
  trackAlbumEl.innerText = track.album.title;
  let trackAlbumImageEl = document.createElement("img");
  trackAlbumImageEl.src = track.album.cover_medium;
  trackAlbumImageEl.setAttribute("style", "float:right");
  trackBodyEl.append(
    trackAlbumImageEl,
    trackTitleEl,
    trackArtistEl,
    trackAlbumEl,
    trackAudioEl
  );
  addEffects();
};

const getUsername = username => {
  return fetch(`http://localhost:3000/users/${username}`, {
    method: "GET"
  }).then(resp => resp.json());
};
