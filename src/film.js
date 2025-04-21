import './styles/style.css';
import './styles/film.css';

if (module.hot) {
  module.hot.accept();
}


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
  },
  getVehiclePilot: function(pilotID) {
    // the pilot is given as a url and id is the last part
    const splitURL = pilotID.split('/');
    const id = splitURL.pop();
    const pilotName = filmModel.people.filter((name) => id === name.id);
    return pilotName[0].name;
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

/**
 * Dynamic modal creation ready to be populated
 * @params {string} title - header text for the modal, defaults to something
 * @returns {object} with two properties, modalBody to be populated and the modalPopup who is the parent
 */
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

// Creates the People modal and populates it
const filmPeople = {
  ini: function(people, cElem) {
    const {modalPopup, modalBody} = filmModal('People');

    // list of item attributes
    people.forEach(person => {
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const profileBox = cElem('DIV');
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
      header.append(h3);
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

// Creates the Species modal and populates it
const filmSpecies = {
  ini: function(species, cElem) {
    const {modalPopup, modalBody} = filmModal('Species');

    species.forEach(specie => {
      const article = cElem('ARTICLE');
      article.setAttribute('class', 'pghi-card');
      let ul = cElem('UL');
      ul.setAttribute('class', 'pghi-card__body--list');
      let ulL2, li, span, p;
      const header = cElem('HEADER');
      header.setAttribute('class', 'pghi-card__header');
      const h3 = cElem('H3', specie.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      header.appendChild(h3);
      const div = cElem('DIV');
      div.setAttribute('class', 'pghi-card__body');
      article.append(header);

      // list item - classification
      li = cElem('LI');
      li.setAttribute('class', 'pghi-card__body--list-item');
      p = cElem('P');
      p.setAttribute('class', 'pghi-card__body--list-item');
      let textNode = document.createTextNode(specie.classification);
      span = cElem('SPAN', "Classification: ");
      p.prepend(span, textNode);
      li.append(p);
      ul.append(li);

      // list item - eye colours
      li = cElem('LI');
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Eye Colours: ");
      ulL2 = cElem('UL');
      ulL2.setAttribute('class', 'pghi-card__body--list');
      specie.eye_colors.split(', ').forEach(color => {
        let li = cElem('LI', color);
        ulL2.appendChild(li);
      });
      li.append(span, ulL2);
      ul.append(li);

      // list of hair colours
      li = cElem('LI');
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Hair Colours: ");
      ulL2 = cElem('UL');
      ulL2.setAttribute('class', 'pghi-card__body--list');
      specie.hair_colors.split(', ').forEach(color => {
        let li = cElem('LI', color);
        ulL2.appendChild(li);
      });
      li.append(span, ulL2);
      ul.append(li);

      div.append(ul);
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

// Creates the Locations modal and populates it
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
      ul.setAttribute('class', 'pghi-card__body--list');

      // list header
      const h3 = cElem('H3', location.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      header.appendChild(h3);

      // climate
      let li = cElem('LI', location.climate);
      li.setAttribute('class', 'pghi-card__body--list-item');
      let span = cElem('SPAN', "Climate: ");
      li.prepend(span);
      ul.appendChild(li);

      // terrain
      li = cElem('LI', location.terrain);
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Terrain: ");
      li.prepend(span);
      ul.appendChild(li);

      // surface water
      li = cElem('LI', location.surface_water);
      li.setAttribute('class', 'pghi-card__body--list-item');
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

// Creates the Vehicles modal and populates it
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
      ul.setAttribute('class', 'pghi-card__body--list');

      // list header - vehicle name
      const h3 = cElem('H3', vehicle.name);
      h3.setAttribute('class', 'pghi-card__header--title');
      profileBox.appendChild(profile);
      header.append(profileBox, h3);
      div.appendChild(header);

      // vehicle class
      let li = cElem('LI', vehicle.vehicle_class);
      li.setAttribute('class', 'pghi-card__body--list-item');
      let span = cElem('SPAN', "Vehicle Class: ");
      li.prepend(span);
      ul.appendChild(li);

      // vehicle pilot
      li = cElem('LI', filmController.getVehiclePilot(vehicle.pilot));
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Pilot: ");
      li.prepend(span);
      ul.appendChild(li);

      // vehicle length
      li = cElem('LI', vehicle.length);
      li.setAttribute('class', 'pghi-card__body--list-item');
      span = cElem('SPAN', "Length: ");
      li.prepend(span);
      ul.appendChild(li);

      // vehicle description
      li = cElem('LI', vehicle.description);
      li.setAttribute('class', 'pghi-card__body--list-item');
      ul.appendChild(li);

      // put it all together
      div.appendChild(ul);
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
