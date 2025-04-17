import './styles/style.css';
import './styles/film.css';


// Model, use an object for each topic of information
const filmModel = {
  baseURL: 'https://ghibliapi.vercel.app/',
  film: {},
  people: {},
  species: {},
  locations: {},
  vehicles: {}
}

// Controller
const filmController = {
  init: function() {
    // regex to separate the url query
    let rex = /[?|=|&]/;
    const filmID = window.location.search.split(rex)[2];
    this.queryAPI('films', filmID).then(film => {
      filmModel.film = film;
      // prep the film main view
      console.log("FILM: ", filmModel.film)
      filmInfo.ini(filmModel.film);
      // start prep for film extras
      this.filmExtraInfo();
    });
  },
  filmExtraInfo: async function(){
    // await for film info to be fetched and model updated
    await this.getExtraInfo('people');
    await this.getExtraInfo('species');
    await this.getExtraInfo('locations');
    await this.getExtraInfo('vehicles');

    // create cards for the people in the film
    filmPeople.ini(filmModel.people, this.createElement);

    // create cards for the species in the film
    filmSpecies.ini(filmModel.species, this.createElement);

    // create cards for the locations in the film
    filmLocations.ini(filmModel.locations, this.createElement);

    // create cards for the vehicles in the film
    filmVehicles.ini(filmModel.vehicles, this.createElement);
  },
  getExtraInfo: function(endpoint) {
    const request = filmModel.film[endpoint].map(person => {
      // urls without id end in '/' so lets split the str with it
      let url = person.split('/');
      // the last two values of split are the endpoint and id (if specified)
      return this.queryAPI(url[url.length - 2], url[url.length - 1]);
    });
    return Promise.all(request).then(response => {
      let movieInfo = response;
      // thin out array of arrays and send through filter
      if (response[0][0]) {
        response = response[0];
        movieInfo = this.filterResults(response);
      }
      this.updateModel(endpoint, movieInfo);
    });
  },
  filterResults: function(data) {
    let filteredData = data.filter(item => {
      for (let i=0; i < item['films'].length; i++) {
        if (item['films'][i].includes(filmModel.film.id)) {
          return true;
        }
      }
    });
    return filteredData;
  },
  updateModel: function(endpoint, data) {
    // with just the endpoint and data you can update any property in the model
    filmModel[endpoint] = data;
  },
  queryAPI: async function(src, id = '') {
    const url = filmModel.baseURL + src + '/' + id;
    return await fetch(url).then(data => data.json());
  },
  createElement: function(eleName, text = false) {
    let el = document.createElement(eleName);
    if (text !== false) {
      el.textContent = text || 'NA';
    }
    return el;
  }
}

// Views
const filmInfo = {
  ini: function(film){
    // film header
    const h1 = document.createElement('H1')
    h1.textContent = film.title;
    const h3 = document.createElement('H3');
    h3.textContent = film.original_title;

    // hero movie banner
    const movieBanner = document.createElement('IMG');
    movieBanner.setAttribute('alt', `movie banner for ${film.original_title_romanised}`);
    movieBanner.setAttribute('src', film.movie_banner);

    // film description
    const desc = document.createElement('P');
    desc.textContent = film.description;

    // render the film view
    const view = {title: h1, subtitle: h3, description: desc, movieBanner, film}
    this.render(view);
  },
  render: function(view) {
    const title = document.querySelector('#pGhiFilmHeroHeader');
    const description = document.querySelector('#pGhiFilmDescBody');
    const heroBanner = document.querySelector('#pGhiFilmHeroBanner');
    // four span are filled in order with: release_date, running_time, director, producer
    const infoList = document.querySelectorAll('#pGhiFilmInfoList > li > span');
    // movie title english, japanese
    title.append(view.title, view.subtitle);
    description.appendChild(view.description);
    // hero movie banner
    heroBanner.append(view.movieBanner)
    // film info
    infoList[0].textContent = view.film.release_date;
    infoList[1].textContent = view.film.running_time;
    infoList[2].textContent = view.film.director;
    infoList[3].textContent = view.film.producer;
  }
}

// TODO: CREATE AND RETURN THE MODAL TO POPULATE
const filmModal = function(title = 'something') {
  const cElem = el => document.createElement(el);
  const cAttr = (el, at, value) => {
    el.setAttribute(at, value);
  }

  // popup wrapper
  const modalPopup = cElem('DIV');
  cAttr(modalPopup, 'class', 'pghi-film__popup');

  // popup header
  const modalHeader = cElem('DIV');
  cAttr(modalHeader, 'class', 'pghi-film__popup-header');
  const h2 = cElem('H2');
  h2.textContent = title;
  const closeBtn = cElem('A');
  closeBtn.href = '#';
  closeBtn.textContent = 'close';
  modalHeader.append(h2, closeBtn);

  modalPopup.append(modalHeader);
  // popup content
  const modalBody = cElem('DIV');
  cAttr(modalBody, 'class', 'pghi-film__popup-body');

  return {modalPopup, modalBody};
}

const filmPeople = {
  ini: function(people, cElem) {
    const {modalPopup, modalBody} = filmModal('People');

    // list of item attributes
    people.forEach(person => {
      console.log("THE PERSONS: ", person);
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const profileBox = cElem('DIV');
      profileBox.setAttribute('class', 'pghi-card__header--profile');
      const profile = cElem('IMG');
      const h3 = cElem('H3');
      h3.setAttribute('class', 'pghi-card__header--title');
      const div = cElem('DIV');
      div.setAttribute('class', 'pghi-card__body');
      const ul = cElem('UL');
      ul.setAttribute('class', 'pghi-card__body--list');

      h3.textContent = person.name;

      // TODO: IMPROVE LIST CREATION, only doing it this way because of time constraints
      let li = cElem('LI', person.age);
      li.setAttribute('class', 'pghi-card__body--list-item');
      let span = cElem('SPAN', "Age: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.gender);
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Gender: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.eye_color);
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Eye colour: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.hair_color);
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Hair colour: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI');
      span = cElem('SPAN');
      // character header
      profileBox.appendChild(profile);
      header.append(profileBox, h3);
      div.appendChild(ul);
      // assemble the card for film individual
      article.append(header, div);
      modalBody.appendChild(article);
    });

    modalPopup.append(modalBody);
    // now render the peoples block
    this.render(modalPopup);
  },
  render: function(view) {
    const container = document.querySelector('#pGhiExtrasPeoplePopup');
    container.appendChild(view);
  }
};

const filmSpecies = {
  ini: function(species, cElem) {
    const {modalPopup, modalBody} = filmModal('Species');

    species.forEach(specie => {
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      let ul = cElem('UL');
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const h3 = cElem('H3', specie.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      header.appendChild(h3);
      const div = cElem('DIV');
      div.setAttribute('class', 'pghi-card__body');
      article.append(header);

      let p = cElem('P', specie.classification);
      let span = cElem('SPAN', "Classification: ");
      p.prepend(span);
      div.append(p);

      // list of eye colours
      p = cElem('P', "Eye Colours: ");
      specie.eye_colors.split(', ').forEach(color => {
        let li = cElem('LI', color);
        ul.appendChild(li);
      });
      div.append(p, ul);

      // list of hair colours
      p = cElem('P', "Hair Colours: ");
      ul = cElem('UL');
      specie.hair_colors.split(', ').forEach(color => {
        let li = cElem('LI', color);
        ul.appendChild(li);
      });
      div.append(p, ul);
      article.append(div);
      modalBody.appendChild(article);
    });

    modalPopup.append(modalBody);
    // render the species block
    this.render(modalPopup);
  },
  render: function(view) {
    const container = document.querySelector('#pGhiExtrasSpeciesPopup');
    container.appendChild(view);
  }
}
const filmLocations = {
  ini: function(locations, cElem) {
    const {modalPopup, modalBody} = filmModal('Locations');

    locations.forEach(location => {
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const div = cElem('DIV');
      div.setAttribute('class', 'pghi-card__body');
      const ul = cElem('UL');

      const h3 = cElem('H3', location.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      header.appendChild(h3);
      let li = cElem('LI', location.climate);
      let span = cElem('SPAN', "Climate: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', location.terrain);
      span = cElem('SPAN', "Terrain: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', location.surface_water);
      span = cElem('SPAN', "Surface Water: ");
      li.prepend(span);
      ul.appendChild(li);
      div.append(ul);
      article.append(header, div);
      modalBody.appendChild(article);
    });

    modalPopup.append(modalBody);
    // render the species block
    this.render(modalPopup);
  },
  render: function(view) {
    const container = document.querySelector('#pGhiExtrasLocationsPopup');
    container.appendChild(view);
  }
}

const filmVehicles = {
  ini: function(vehicles, cElem) {
    const {modalPopup, modalBody} = filmModal('Vehicles');

    vehicles.forEach(vehicle => {
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const div = cElem('DIV');
      div.setAttribute('class', 'pghi-card__body');
      const profileBox = cElem('DIV');
      const profile = cElem('IMG');
      const ul = cElem('UL');

      const h3 = cElem('H3', vehicle.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      profileBox.appendChild(profile);
      header.append(profileBox, h3);
      div.appendChild(header);

      let p = cElem('P', vehicle.vehicle_class);
      let span = cElem('SPAN', "Vehicle Class: ");
      p.prepend(span);
      div.appendChild(p);

      p = cElem('P', vehicle.length);
      span = cElem('SPAN', "Length: ");
      p.prepend(span);
      div.appendChild(p);

      p = cElem('P', vehicle.description);
      div.appendChild(p);
      article.append(div);
      modalBody.appendChild(article);
    });

    modalPopup.append(modalBody);
    // render the species block
    this.render(modalPopup);
  },
  render: function(view) {
    const container = document.querySelector('#pGhiExtrasVehiclesPopup');
    container.appendChild(view);
  }
}

filmController.init();
