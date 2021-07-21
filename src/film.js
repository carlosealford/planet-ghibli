console.log(`Hello Web Shuriken, film module is connected waiting for instructions...`);
// Model, use an object for each topic of information
const filmMode = {
  baseURL: 'https://ghibliapi.herokuapp.com/',
  film: {},
  people: {},
  species: {},
  locations: {},
  vehicles: {}
}

// Controller
const filmController = {
  init: function() {
    console.log("STARTING THE CONTROLLER");
    // regex to separate the url query
    let rex = /[?|=|&]/;
    const filmID = window.location.search.split(rex)[2];
    this.queryAPI('films/', filmID).then(film => {
      filmMode.film = film;
      // prep the film main view
      filmInfo.render(filmMode.film);
    });
  },
  queryAPI: function(src, id) {
    const url = filmMode.baseURL + src + id;
    return fetch(url).then(data => data.json());
  }
}

// Views
const filmInfo = {
  render: function(film) {
    const title = document.querySelector('#pGhiFilmHeroHeader');
    const description = document.querySelector('#pGhiFilmDescBody');
    // four span are filled in order with: release_date, running_time, director, producer
    const infoList = document.querySelectorAll('#pGhiFilmInfoList > li > span');

    // film header
    const h2 = document.createElement('H2')
    h2.textContent = film.title;
    const h3 = document.createElement('H3');
    h3.textContent = film.original_title;

    // film description
    const desc = document.createElement('P');
    desc.textContent = film.description;

    // can be improved...
    title.appendChild(h2);
    title.appendChild(h3);
    description.appendChild(desc);
    // film info
    infoList[0].textContent = film.release_date;
    infoList[1].textContent = film.running_time;
    infoList[2].textContent = film.director;
    infoList[3].textContent = film.producer;
  }
}

const filmPeople = {};
const filmSpecies = {}
const filmLocations = {}
const filmVehicles = {}

filmController.init();
