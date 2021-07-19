// Model, will be fetched and populated by controller
const filmsModel = {
  films: []
}

/**
 * Controller
 * - initFilms - populates the model
 * - createFilmsPage - creates the films page
 * - getFilms - fetch films from API
 * - openFilmPage - detect which film was clicked and opens its film page
 */
const filmController = {
  initFilms: function() {
    this.getFilms().then(films => {
      // TODO: add the image url to each film object
      filmsModel.films = films;
      this.createFilmsPage(films);
    });
  },
  createFilmsPage: function(films) {
    filmsView.init(films);
  },
  getFilms: function(url) {
    return fetch('https://ghibliapi.herokuapp.com/films', {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(data => data.json());
  },
  openFilmPage: function(e) {
    e.preventDefault();
    // only react to clicks inside the li element
    if (e.target.nodeName === 'UL') return;
    // TODO: load the film page
    console.log("CONTROLLER VALUE: ", e);
  }
}

/**
 * View
 * - init - prepares the list of films
 * - render - appends the list to the DOM
 */
const filmsView = {
  init: function(films) {
    // use unordered list
    const ul = document.createElement('UL');
    let li, div, h4, img, text;

    // only list wrapper listens for click
    ul.addEventListener('click', filmController.openFilmPage);

    // create a list item with image and title for each film
    films.forEach((film) => {
      // prep first list element
      li = document.createElement('LI');
      // use div to wrap film image and title
      div = document.createElement('DIV');
      div.setAttribute('data-filmid', film.id)
      li.appendChild(div);

      // create title with text node
      h4 = document.createElement('H4');
      text = document.createTextNode(film.title);
      h4.appendChild(text);

      // create image
      img = document.createElement('IMG');
      img.setAttribute('src', '#');
      img.setAttribute('alt', film.title);

      div.appendChild(h4);
      div.appendChild(img);
      li.appendChild(div);
      ul.appendChild(li);
    });

    // render the list of films
    this.render(ul);

  },
  render: function(view) {
    const parent = document.querySelector('#pGhiFilmsList');
    parent.appendChild(view);
  }
}

/**
 * @description gets the home page going
 */
function buildPage() {
  filmController.initFilms();
}

buildPage();
