import './assets/css/style.css';
import './assets/css/home.css';
import { TFilmsList, TFilmsData, IFilm } from '../global';


// Webpack features to enable live code updates without full page reload.
if (module.hot) {
  // register a callback to handle updates for the current module or dependencies
  module.hot.accept();
}

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
      li.className = "films-list__skeleton";
      this.filmsList.appendChild(li);
    }
    // render it
    this.filmsBody.appendChild(this.filmsList);
  }

  renderView( data: TFilmsData ): void {
    // remove skeletons from list
    while (this.filmsList.firstChild) {
      this.filmsList.removeChild(this.filmsList.firstChild);
    }

    // load list will films data
    if (data.status === "ok" && data.films.length !== 0) {
      data.films.forEach((film) => {
        // prep the list item, with unique film id
        const li = document.createElement("li");
        li.className = "films__list-item";
        li.setAttribute("data-filmid", film.id);

        // prep the img
        const img = document.createElement("img");
        img.setAttribute("src", film.image);
        img.setAttribute("alt", film.title);

        li.append(img);

        // attach item to parent ul
        this.filmsList.appendChild(li);
      });

      // attach ul to wrapper div
      this.filmsBody.append(this.filmsList); 
    }else{
      // render sad message
      const para = document.createElement("p");
      const node = document.createTextNode("Unable to get Films data -_-");
      para.append(node);
      this.filmsBody.append(para);
    }

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
    this.loadFilms();
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

    // delay the render by 1 seconds so user appreciates the skeletons
    setTimeout(() => {
      // render films
      this.view.renderView({
        status: allFilmsData !== "error" ? "ok" : "error",
        films: this.model.filmsData,
      });
    }, 1000);
  }

  private loadFilmPage( id: string ): void {}
}

const app = new HomeController(new HomeModel, new HomeView);
