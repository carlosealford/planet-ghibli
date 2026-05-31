import './css/style.css';
import './css/film.css';
import {
  IAPIFilm,
  IAPIPeople,
  IAPILocations,
  IAPIVehicles,
  TAPIResponse,
  IFilm,
  IPeople,
  ILocations,
  IVehicles,
  TFilmURLDirectory,
  TFilmData,
  TFilmExtrasData,
  IFilmExtras,
  TMissingFilmExtras,
  TFectchStatus,
  TFilm
} from '../global';


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

console.log('YOU ARE IN FILM PAGE')

// Data & Logic
class FilmModel {
  readonly #baseURL: string = "https://ghibliapi.vercel.app/";
  #id: string = "";
  #film: TFilm = {};
  #people: IPeople[] = [];
  #locations: ILocations[] = [];
  #vehicles: IVehicles[] = [];

  get baseURL() {
    return this.#baseURL;
  }

  set id( id: string ) {
    this.#id = id;
  }
  get id() {
    return this.#id;
  }

  set film( data: TFilm ) {
    this.#film = data;
  }
  get film(): TFilm {
    return this.#film;
  }

  set people( data: IPeople[] ) {
    this.#people = data;
  }
  get people() {
    return this.#people;
  }

  set vehicles( data: IVehicles[] ) {
    this.#vehicles = data;
  }
  get vehicles() {
    return this.#vehicles;
  }

  set locations( data: ILocations[] ) {
    this.#locations = data;
  }
  get locations() {
    return this.#locations;
  }
}

// UI & DOM
class FilmView {
  constructor() {}

  renderSkeleton(): void {
    console.log("TODO: RENDER SKELETONS")
  }

  render( film: TFilmData ): void {
    console.log("TODO RENDER FILM");
    // TODO: WORKING ON THIS ONE RIGHT NOW.
  }

  renderFilmExtras( extras: TFilmExtrasData ): void {
    console.log("TODO: RENDER FILM EXTRAS");
  }

  // createPeopleCards( people: IPeople[] ): HTMLDivElement {
  //   console.log("TODO: RENDER PEOPLE CARDS")
  // }

  // createVehicleCards( vehicles: IVehicles[] ): HTMLDivElement {
  //   console.log("TODO: RENDER VEHICLES CARDS")
  // }

  // createLocationsCards( locations: ILocations[] ): HTMLDivElement {
  //   console.log("TODO: RENDER LOCATIONS")
  // }
}


// Link
class FilmController {
  readonly #model: FilmModel;
  readonly #view: FilmView;
  constructor(model: FilmModel, view: FilmView) {
    this.#model = model;
    this.#view = view;

    // get me the films unique ID
    const filmID = FilmController.getFilmID();
    if (filmID !== "") {
      this.#model.id = filmID;
    }

    // TODO: skeleton render
    // this.#view.renderSkeleton();

    // TODO: load film details
    this.loadFilm();

    // TODO: load film extras
    // this.loadFilmExtras();
  }

  /**
   * Uses regex to separate the film id from the URL string
   * @returns string
   */
  static getFilmID(): string {
    // regex to separate the url query
    let rex = /[?|=|&]/;
    return window.location.search.split(rex)[2];
  }

  /**
   * Uses API to retrieve all data relating to a single category or single film by id
   * @param category K <K extends keyof TAPIResponse>
   * @returns Promise<TAPIResponse[K] | "error"
   */
  private async fetchData<K extends keyof TAPIResponse>( category: K ): Promise<TAPIResponse[K] | "error">  {
    try {
      // get a single film data and all data for other categories
      const url = category === "films"
        ? `${this.#model.baseURL}${category}/${this.#model.id}`
        : `${this.#model.baseURL}${category}`;
      
      // fetch data
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      // no data no go
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
      }

      // lets guaranty the body of the response
      const data = (await response.json()) as TAPIResponse[K];
      return data
    } catch (error) {
      console.log(error);
      return "error";
    }
  }

  /**
   * prepares the film descriptions and stores it into model.film
   * @returns Promise<void>
   */
  private async loadFilm(): Promise<void> {
    // get the data we need
    const data = await this.fetchData("films");
    let film: Partial<IFilm> = {};

    // no data no execution, end it
    if (data !== "error") { 
      // extra exactly what we need from 'data' catching missing properties
      const validKeys: Array<keyof IFilm> = [
        "title",
        "original_title",
        "original_title_romanised",
        "movie_banner",
        "description",
        "director",
        "producer",
        "release_date",
        "running_time"
      ];
      
      // dynamically create the IFilm object
      for (const key of validKeys) {
        film[key] = data[key] ?? "film object key error"
      }
      
    }

    // reassurrance that we will return the valid type
    this.#model.film = film as TFilm;
    
    // render the film descriptions
    this.#view.render({
      status: data === "error" ? "error" : "ok",
      film: this.#model.film
    });
  }

  /**
   * loads all the extra details for a film like people, vehicles and locations
   */
  private async loadFilmExtras(): Promise<void> {
    // film id to check the extras against
    const filmURLID = `${this.#model.baseURL}films/${this.#model.id}`;
    // tracks missing extras as strings
    const missingExtras: TMissingFilmExtras = []

    // fetch all people
    const peopleData = await this.fetchData("people");
    let people: IPeople[];

    // are we able to dig deeper into people
    if (peopleData !== "error") {
      people = peopleData.filter((person) => {
        // check for matching film id
        return person.films.some((url) => url === filmURLID);
      });

      // store the people
      this.#model.people = people;
    }else{
      missingExtras.push("people");
    };


    // fetch all vehicles
    const vehiclesData = await this.fetchData("vehicles");
    let vehicles: IVehicles[];

    // are we able to dig deeper into vehicles
    if (vehiclesData !== "error") {
      vehicles = vehiclesData.filter((vehicle) => {
        // check for matching film id
        return vehicle.films.some((url) => url === filmURLID );
      });

      // store the vehicles
      this.#model.vehicles = vehicles;
    }else{
      missingExtras.push("vehicles");
    };

    // fetch all locations
    const locationsData = await this.fetchData("locations");
    let locations: ILocations[];

    // are we able to dig deeper into locations
    if (locationsData !== "error") {
      locations = locationsData.filter((location) => {
        // check for matching film id
        return location.films.some((url) => url === filmURLID );
      });

      // store the locations
      this.#model.locations = locations;
    }else{
      missingExtras.push("locations");
    };
    
    // render the film extras
    this.#view.renderFilmExtras({
      status: missingExtras.length === 0 ? "ok" : missingExtras.length === 3 ? "error" : "partial",
      missing: missingExtras,
      extras: {
        people: this.#model.people,
        vehicles: this.#model.vehicles,
        locations: this.#model.locations
      }
    });
  }
}

const app = new FilmController(new FilmModel, new FilmView);
