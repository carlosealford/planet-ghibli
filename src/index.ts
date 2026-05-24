import './assets/css/style.css';
import './assets/css/home.css';
import { TFilmsList, TFilmsData, IFilm } from '../global';


// Webpack features to enable live code updates without full page reload.
if (module.hot) {
  // register a callback to handle updates for the current module or dependencies
  module.hot.accept();
}

/*
// 1. THE MODEL - Data & Logic
class TodoModel {
  constructor() {
    this.todos = ['Learn JavaScript', 'Build MVC App'];
  }

  addTodo(text) {
    this.todos.push(text);
    // This is where you'd trigger a callback to update the UI
  }
}

// 2. THE VIEW - The UI & DOM
class TodoView {
  constructor() {
    this.app = document.getElementById('root');
    this.input = document.querySelector('#todo-input');
    this.submitBtn = document.querySelector('#add-btn');
  }

  render(todos) {
    // Logic to clear the list and redraw it based on the Model
    console.log("Current Todos:", todos);
  }

  bindAddTodo(handler) {
    this.submitBtn.addEventListener('click', () => {
      if (this.input.value) {
        handler(this.input.value);
        this.input.value = '';
      }
    });
  }
}

// 3. THE CONTROLLER - The Link
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Link the View's event to the Model's logic
    this.view.bindAddTodo(this.handleAddTodo);
    
    // Initial draw
    this.view.render(this.model.todos);
  }

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText);
    this.view.render(this.model.todos);
  }
}

// 4. INITIALIZATION
const app = new TodoController(new TodoModel(), new TodoView());
*/

// Model, will be fetched and populated by controller
// const HOME_MODEL = {
//   baseURL: 'https://ghibliapi.vercel.app/',
//   films: []
// }

// Data & Logic
class HomeModel {
  readonly baseURL: string = "https://ghibliapi.vercel.app/";
  private films: TFilmsList = [];
  // used to update the whole list
  set filmsData( films: TFilmsList ) {
    this.films = films;
  }
  get filmsData(): TFilmsList {
    return this.films;
  }
}

//The UI & DOM
class HomeView {
  private readonly filmsBody: HTMLDivElement;
  private readonly filmsList: HTMLUListElement;
  constructor() {
    this.filmsBody = document.getElementById("filmsBody") as HTMLDivElement;
    this.filmsList = document.createElement("ul");
    this.filmsList.className = "films-list";
  }

  bindLoadFilmPage( handler: ( id: string ) => void): void {
    console.log("YOU NEED TO BIND THIS LISTENER");
  }

  renderSkeleton(): void {
    // create four list items no images required
    for (let i=0; i < 5; i++) {
      let li = document.createElement("li");
      li.className = 'films-list__skeleton';
      this.filmsList.appendChild(li);
    }
    // render it
    this.filmsBody.appendChild(this.filmsList);
  }

  renderView( films: TFilmsData ): void {
    console.log('RENDER THE VIEW')
  }
}

// The Link
class HomeController {
  private model: HomeModel;
  private view: HomeView
  constructor(model: HomeModel, view: HomeView) {
    this.model = model;
    this.view = view;

    // comms with API and prepare films data
    // this.loadFilms();
    // render skeleton while waiting for films to be ready
    this.view.renderSkeleton();
  }

  // deals with the fetch logic returning the result
  private async fetchData(): Promise<IFilm[] | "error"> {
    try {
      const response = await fetch(`${this.model.baseURL}films`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // before going any further
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
      }

      // lets collect our film data
      const data: IFilm[] = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return "error";
    }
  }

  private async loadFilms() {
    const allFilmsData = await this.fetchData();
    let films: TFilmsList = [];

    // lets make sure we have some films
    if (allFilmsData !== "error") {
      films = allFilmsData.map(film => {
        return {
          id: film.id,
          title: film.title,
          image: film.image
        }
      });

      // lets store the edited films list
      this.model.filmsData = films;
    }
    console.log("FILMS READY TO LOAD");
    console.log(films)
  }

  private loadFilmPage( id: string ): void {}
}

const app = new HomeController(new HomeModel, new HomeView);

// console.log("lalalalala");
// console.log(app)
/**

//
 // Controller
 // - initFilms - populates the model
 // - createFilmsPage - creates the films page
 // - getFilms - fetch films from API
 // - openFilmPage - detect which film was clicked and opens its film page
 //
const homeController = {
  initFilms: function() {
    this.getFilms().then(films => {
      HOME_MODEL.films = films;
      this.createFilmsPage(films);
    });
  },
  createFilmsPage: function(films) {
    homeView.init(films);
  },
  getFilms: function() {
    return fetch(HOME_MODEL.baseURL + 'films', {
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

//
 // View
 // - init - prepares the list of films
 // - render - appends the list to the DOM
 ///
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

//
 // @description gets the home page going
 //
function buildPage() {
  homeController.initFilms();
}

buildPage();


 */

