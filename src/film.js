// Model, use an object for each topic of information
const filmModel = {
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
  queryAPI: function(src, id = '') {
    const url = filmModel.baseURL + src + '/' + id;
    return fetch(url).then(data => data.json());
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
    const h2 = document.createElement('H2')
    h2.textContent = film.title;
    const h3 = document.createElement('H3');
    h3.textContent = film.original_title;

    // film description
    const desc = document.createElement('P');
    desc.textContent = film.description;

    // render the film view
    this.render(h2, h3, desc, film);
  },
  render: function(h2, h3, desc, film) {
    const title = document.querySelector('#pGhiFilmHeroHeader');
    const description = document.querySelector('#pGhiFilmDescBody');
    // four span are filled in order with: release_date, running_time, director, producer
    const infoList = document.querySelectorAll('#pGhiFilmInfoList > li > span');
    // can be improved...
    title.append(h2, h3);
    description.appendChild(desc);
    // film info
    infoList[0].textContent = film.release_date;
    infoList[1].textContent = film.running_time;
    infoList[2].textContent = film.director;
    infoList[3].textContent = film.producer;
  }
}

const filmPeople = {
  ini: function(people, cElem) {
    const parent = document.createElement('DIV');

    // list of item attributes
    people.forEach(person => {
      const article = cElem('ARTICLE');
      const header = cElem('HEADER');
      const profileBox = cElem('DIV');
      const profile = cElem('IMG');
      const h3 = cElem('H3');
      const div = cElem('DIV');
      const ul = cElem('UL');

      h3.textContent = person.name;

      // TODO: IMPROVE LIST CREATION, only doing it this way because of time constraints
      let li = cElem('LI', person.age);
      let span = cElem('SPAN', "Age: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.gender);
      span = cElem('SPAN', "Gender: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.eye_color);
      span = cElem('SPAN', "Eye colour: ");
      li.prepend(span);
      ul.appendChild(li);
      li = cElem('LI', person.hair_color);
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
      parent.appendChild(article);
    });

    // now render the peoples block
    this.render(parent);
  },
  render: function(view) {
    const container = document.querySelector('#pghiExtrasPeople');
    container.appendChild(view);
  }
};

const filmSpecies = {
  ini: function(species, cElem) {
    const parent = cElem('DIV');

    species.forEach(specie => {
      const article = cElem('ARTICLE');
      let ul = cElem('UL');
      const header = cElem('HEADER');
      const h3 = cElem('H3', specie.name);
      header.appendChild(h3);
      article.append(header);

      let p = cElem('P', specie.classification);
      let span = cElem('SPAN', "Classification: ");
      p.prepend(span);
      article.append(p);

      // list of eye colours
      p = cElem('P', "Eye Colours: ");
      specie.eye_colors.split(', ').forEach(color => {
        li = cElem('LI', color);
        ul.appendChild(li);
      });
      article.append(p, ul);

      // list of hair colours
      p = cElem('P', "Hair Colours: ");
      ul = cElem('UL');
      specie.hair_colors.split(', ').forEach(color => {
        li = cElem('LI', color);
        ul.appendChild(li);
      });
      article.append(p, ul);
      parent.appendChild(article);
    });

    // render the species block
    this.render(parent);
  },
  render: function(view) {
    const container = document.querySelector('#pghiExtrasSpecies');
    container.appendChild(view);
  }
}
const filmLocations = {
  ini: function(locations, cElem) {
    const parent = cElem('DIV');

    locations.forEach(location => {
      const article = cElem('ARTICLE');
      const header = cElem('HEADER');
      const ul = cElem('UL');

      const h3 = cElem('H3', location.name);
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
      article.append(header, ul);
      parent.appendChild(article);
    });

    // render the species block
    this.render(parent);
  },
  render: function(view) {
    const container = document.querySelector('#pghiExtrasLocations');
    container.appendChild(view);
  }
}

const filmVehicles = {
  ini: function(vehicles, cElem) {
    const parent = cElem('DIV');

    vehicles.forEach(vehicle => {
      const article = cElem('ARTICLE');
      const header = cElem('HEADER');
      const profileBox = cElem('DIV');
      const profile = cElem('IMG');
      const ul = cElem('UL');

      const h3 = cElem('H3', vehicle.name);
      profileBox.appendChild(profile);
      header.append(profileBox, h3);
      article.appendChild(header);

      let p = cElem('P', vehicle.vehicle_class);
      let span = cElem('SPAN', "Vehicle Class: ");
      p.prepend(span);
      article.appendChild(p);

      p = cElem('P', vehicle.length);
      span = cElem('SPAN', "Length: ");
      p.prepend(span);
      article.appendChild(p);

      p = cElem('P', vehicle.description);
      article.appendChild(p);
      parent.appendChild(article);
    });

    // render the species block
    this.render(parent);
  },
  render: function(view) {
    const container = document.querySelector('#pghiExtrasVehicles');
    container.appendChild(view);
  }
}

filmController.init();
