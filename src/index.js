import './styles/style.css';
import './styles/home.css';
import heroImageLarge from './assets/images/studio-ghibli-bg.jpg'

if (module.hot) {
  module.hot.accept();
}


// Model, will be fetched and populated by controller
const homeModel = {
  baseURL: 'https://ghibliapi.vercel.app/',
  films: []
}

/**
 * Controller
 * - initFilms - populates the model
 * - createFilmsPage - creates the films page
 * - getFilms - fetch films from API
 * - openFilmPage - detect which film was clicked and opens its film page
 */
const homeController = {
  initFilms: function() {
    this.getFilms().then(films => {
      homeModel.films = films;
      this.createFilmsPage(films);
    });
  },
  createFilmsPage: function(films) {
    homeView.init(films);
  },
  getFilms: function() {
    return fetch(homeModel.baseURL + 'films', {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(data => data.json());
  },
  openFilmPage: function(e) {
    e.preventDefault();
    // only react to clicks inside the li element
    if (e.target.nodeName === 'UL') return;
    // navigate to film.html with the film unique id as parameter
    let url = 'film.html?id=' + e.target.parentElement.dataset.filmid;
    window.location.href = url;
  }
}

/**
 * View
 * - init - prepares the list of films
 * - render - appends the list to the DOM
 */
const homeView = {
  init: function(films) {
    // Prep Hero images
    const heroImage = document.createElement('IMG');
    heroImage.setAttribute('src', heroImageLarge);
    heroImage.setAttribute('alt', 'studio ghibli logo image of totoro with japanese title')

    // use unordered list
    const ul = document.createElement('UL');
    ul.setAttribute('class', 'pghi-films__list center-text');
    let li, div, h4, img, text;

    // only list wrapper listens for click. fewer listeners quicker site.
    ul.addEventListener('click', homeController.openFilmPage);

    // create a list item with image and title for each film
    films.forEach((film) => {
      // prep first list element
      li = document.createElement('LI');
      li.setAttribute('class', 'pghi-films__list-item')
      // use div to wrap film image and title
      div = document.createElement('DIV');
      div.setAttribute('data-filmid', film.id)
      div.setAttribute('class', 'pghi-films__list-item--box');
      li.appendChild(div);

      // create title with text node
      h4 = document.createElement('H4');
      text = document.createTextNode(film.title);
      h4.appendChild(text);

      // create image
      img = document.createElement('IMG');
      img.setAttribute('src', film.image);
      img.setAttribute('alt', film.title);

      div.appendChild(h4);
      div.appendChild(img);
      li.appendChild(div);
      ul.appendChild(li);
    });

    // render the list of films
    const view = {list: ul, heroImage: heroImage}
    this.render(view);

  },
  render: function(view) {
    const heroImage = document.querySelector('#pGhiHeroImg');
    heroImage.appendChild(view.heroImage)
    const parent = document.querySelector('#pGhiFilmsListBox');
    parent.appendChild(view.list);
  }
}

/**
 * @description gets the home page going
 */
function buildPage() {
  homeController.initFilms();
}

buildPage();
