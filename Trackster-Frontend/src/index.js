const formEl = document.querySelector("form");
formEl.addEventListener("submit", e => {
  e.preventDefault();
  searchResult(e.target.elements.name.value);
});

const renderResults = fetchedResults => fetchedResults.forEach(result);

//search bar
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
      console.log(results.data);
    })
    .catch(err => {
      console.log(err);
    });
};

//login form
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  getUsername(e.target.elements.username.value);
});

const getUsername = username => {
  fetch(`http://localhost:3000/users/`, {
    method: "GET"
  })
    .then(resp => resp.json())
    .then(data => console.log(data));
};
