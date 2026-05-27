import './css/style.css';
import './css/home.css';
import { 
  IAPIFilm, 
  TFilmsList, 
  TFilmsData
} from '../global';


// Webpack features to enable live code updates without full page reload.
if (module.hot) {
  // register a callback to handle updates for the current module or dependencies
  module.hot.accept();
}

// Data & Logic
class HomeModel {
  readonly baseURL: string = "https://ghibliapi.vercel.app/";
  #films: TFilmsList = [];
  // used to update the whole list
  set films( list: TFilmsList ) {
    this.#films = list;
  }
  get films(): TFilmsList {
    return this.#films;
  }
}

//The UI & DOM
class HomeView {
  readonly #filmsBody: HTMLDivElement;
  readonly #filmsList: HTMLUListElement;
  constructor() {
    this.#filmsBody = document.getElementById("filmsBody") as HTMLDivElement;
    this.#filmsList = document.createElement("ul");
    this.#filmsList.className = "films-list";
  }

  /**
   * Creates event handler for the film posters
   * @param handler ( id: string ) => void
   */
  bindLoadFilmPage( handler: ( id: string ) => void): void {
    this.#filmsList.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();

      // ts checks and stuff
      const target = e.target as HTMLImageElement | null;
      if (!target) return;

      // handle clicks on <li> and children
      const li = target.closest("li[data-filmid]") as HTMLLIElement | null;
      if (!li) return;

      // make sure we have a film id
      const id = li.dataset.filmid;
      if (!id) return;

      handler(id);
    });
  }

  /**
   * Renders page skeletons
   */
  renderSkeleton(): void {
    // create four list items no images required
    for (let i=0; i < 5; i++) {
      let li = document.createElement("li");
      li.className = "films-list__skeleton";
      this.#filmsList.appendChild(li);
    }
    // render it
    this.#filmsBody.appendChild(this.#filmsList);
  }

  /**
   * Renders the frontend view
   * @param data TFilmsData
   */
  renderView( data: TFilmsData ): void {
    // remove skeletons from list
    while (this.#filmsList.firstChild) {
      this.#filmsList.removeChild(this.#filmsList.firstChild);
    }

    // load list will films data
    if (data.status === "ok" && data.films.length !== 0) {
      data.films.forEach((film) => {
        // prep the list item, with unique film id
        const li = document.createElement("li");
        li.className = "films-list__item";
        li.setAttribute("data-filmid", film.id);

        // prep the img
        const img = document.createElement("img");
        img.setAttribute("src", film.image);
        img.setAttribute("alt", film.title);

        li.append(img);

        // attach item to parent ul
        this.#filmsList.appendChild(li);
      });

      // attach ul to wrapper div
      this.#filmsBody.append(this.#filmsList); 
    }else{
      // render sad message
      const para = document.createElement("p");
      const node = document.createTextNode("Unable to get Films data -_-");
      para.append(node);
      this.#filmsBody.append(para);
    }

  }
}

// The Link
class HomeController {
  readonly #model: HomeModel;
  readonly #view: HomeView
  constructor(model: HomeModel, view: HomeView) {
    this.#model = model;
    this.#view = view;

    // link views event to film page loader
    this.#view.bindLoadFilmPage(this.loadFilmPage);

    // comms with API and prepare films data
    this.loadFilms();

    // render skeleton while waiting for films to be ready
    this.#view.renderSkeleton();
  }

  /**
   * Uses API to get all films data from database
   * @returns Promise<IAPIFilm[] | "error">
   */
  private async fetchData(): Promise<IAPIFilm[] | "error"> {
    try {
      const response = await fetch(`${this.#model.baseURL}films`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // before going any further
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
      }

      // lets collect our film data
      const data: IAPIFilm[] = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return "error";
    }
  }

  /**
   * prepares films data and stores it in model.films
   */
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
      this.#model.films = films;
    }

    // delay the render by 1 seconds so user appreciates the skeletons
    setTimeout(() => {
      // render films
      this.#view.renderView({
        status: allFilmsData !== "error" ? "ok" : "error",
        films: this.#model.films,
      });
    }, 1000);
  }

  /**
   * Dynamically loads film page with film id in url
   * @param id string
   */
  private loadFilmPage( id: string ): void {
    // navigate to film.html with the film unique id as parameter
    const url = 'film.html?id=' + id;
    window.location.href = url;
  }
}

const app = new HomeController(new HomeModel, new HomeView);
