import './css/style.css';
import './css/film.css';
import {
  IAPIFilm,
  IAPIPeople,
  IAPILocations,
  IAPIVehicles,
  IAPISpecies,
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


// Data & Logic
class FilmModel {
  readonly #baseURL: string = "https://ghibliapi.vercel.app/";
  #id: string = "";
  #film: TFilm = {};
  #people: IPeople[] = [];
  #locations: ILocations[] = [];
  #vehicles: IVehicles[] = [];
  #residents: string[] = [];

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
  readonly people: HTMLDivElement;
  readonly vehicles: HTMLDivElement;
  readonly locations: HTMLDivElement;
  constructor() {
    this.people = document.getElementById("FilmPeople") as HTMLDivElement;
    this.vehicles = document.getElementById("FilmVehicles") as HTMLDivElement;
    this.locations = document.getElementById("FilmLocations") as HTMLDivElement;
  }

  renderSkeleton(): void {
    console.log("TODO: RENDER SKELETONS")
  }

  render( filmData: TFilmData ): void {
    try {
      // when error do something else
      if (filmData.status === "error") throw new Error("No data from API");

      const film = filmData.film;
      // DOM parents
      const FilmTitle = document.getElementById("FilmHeroTitle") as HTMLDivElement;
      const filmBanner = document.getElementById("FilmHeroBanner") as HTMLImageElement;

      // TODO: WORKING ON THIS PARTS ADING THE STUFF TO IT
      const filmDescription = document.getElementById("LeafletDesc") as HTMLDivElement;
      const filmReleaseDate = document.getElementById("FilmReleaseDate") as HTMLLIElement;
      const filmRunningTime = document.getElementById("FilmRunningTime") as HTMLLIElement;
      const filmDirector = document.getElementById("FilmDirector") as HTMLLIElement;
      const filmProducer = document.getElementById("FilmProducer") as HTMLLIElement;

      // film title
      const h1 = document.createElement("h1");
      const title = document.createTextNode(film.title);
      const span = document.createElement("span");
      const original_title = document.createTextNode(film.original_title);
      h1.appendChild(title);
      span.appendChild(original_title);
      h1.appendChild(span);
      FilmTitle.appendChild(h1);
      
      // film banner
      const img = document.createElement("img");
      img.src = film.movie_banner;
      img.alt = `poster of the film ${film.title}`;
      filmBanner.appendChild(img);

      // film description
      const p = document.createElement("p");
      const desc = document.createTextNode(film.description);
      p.appendChild(desc);
      filmDescription.appendChild(p);

      // film description list
      filmReleaseDate.textContent = film.release_date;
      filmRunningTime.textContent = film.running_time;
      filmDirector.textContent = film.director;
      filmProducer.textContent = film.producer;

    } catch (error) {
      console.error(error);
      // TODO: RENDER SOMETHING TO DEAL WITH ERROR
    }
  }

  renderFilmExtras( extrasData: TFilmExtrasData ): void {
    try {
      // when error do something else
      if (extrasData.status === "error") throw new Error("Issue with all the extras");

      // sort out people
      const people: HTMLDivElement = this.createPeopleCards(extrasData.extras.people);
      this.people.appendChild(people);

      // sort out vehicles
      const vehicles: HTMLDivElement = this.createVehicleCards(extrasData.extras.vehicles);
      this.vehicles.appendChild(vehicles);

      // sort out locations
      const locations: HTMLDivElement = this.createLocationsCards(extrasData.extras.locations);
      this.locations.appendChild(locations);

    } catch(err) {
      console.error(err);
      // TODO: do something with this error, cant have an empty interface
    }
  }

  /**
   * creates a text node
   * @param text string
   * @returns Text reprends text node
   */
  textNode(text: string): Text {
    return document.createTextNode(text);
  }

  /**
   * Creates the list element for each element in the film extra cards
   * @param title string
   * @param text string
   * @returns HTMLLiElement
   */
  liElement(title: string, text: string, classname?: string): HTMLLIElement {
    // Lets keep it DRY right here
    const li = document.createElement("li");

    // add classname when supplied
    if (classname !== undefined && classname.length !== 0) li.setAttribute("class", classname);

    // span is the value from the title key
    const textSpan = document.createElement("span");
    textSpan.appendChild(this.textNode(text));
    li.appendChild(this.textNode(title));
    li.appendChild(textSpan);

    return li;
  }

  createPeopleCards( people: IPeople[] ): HTMLDivElement {
    //.film-extras__no-data
    const div = document.createElement("div");
    div.setAttribute("class", "film-extras__body");

    // we will introduce some data regardless
    if (people.length > 0) {
      people.forEach(person => {
        const article = document.createElement("article");
        article.setAttribute("class", "extras-card");

        const h3 = document.createElement("h3");
        h3.setAttribute("class", "extras-card-title")
        h3.appendChild(this.textNode(person.name));

        const ul = document.createElement("ul");
        const cname = "extras-card-list__item"
        ul.setAttribute("class", "extras-card-list")
        ul.appendChild(this.liElement("Age: ", person.age, cname));
        ul.appendChild(this.liElement("Gender: ", person.gender, cname));
        ul.appendChild(this.liElement("Eye colour: ", person.eye_color, cname));
        ul.appendChild(this.liElement("Hair colour: ", person.hair_color, cname));
        ul.appendChild(this.liElement("Species: ", person.species, cname));

        article.appendChild(h3);
        article.appendChild(ul);

        // all goes in here
        div.appendChild(article);
      });
    }else{
      const p = document.createElement("p");
      p.setAttribute("class", "film-extras__no-data");
      const text = document.createTextNode("No data for People");
      p.appendChild(text);
      div.appendChild(p);
    }

    return div;
  }

  createVehicleCards( vehicles: IVehicles[] ): HTMLDivElement {
    //.film-extras__no-data
    const div = document.createElement("div");
    div.setAttribute("class", "film-extras__body");

    // we will introduce some data regardless
    if (vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        const article = document.createElement("article");
        article.setAttribute("class", "extras-card");

        const h3 = document.createElement("h3");
        h3.setAttribute("class", "extras-card-title")
        h3.appendChild(this.textNode(vehicle.name));

        const ul = document.createElement("ul");
        const cname = "extras-card-list__item"
        ul.setAttribute("class", "extras-card-list")
        ul.appendChild(this.liElement("Class: ", vehicle.vehicle_class, cname));
        ul.appendChild(this.liElement("Length: ", vehicle.length, cname));
        ul.appendChild(this.liElement("Pilot: ", vehicle.pilot, cname));
        ul.appendChild(this.liElement("Description: ", vehicle.description, cname));

        article.appendChild(h3);
        article.appendChild(ul);

        // all goes in here
        div.appendChild(article);
      });
    }else{
      const p = document.createElement("p");
      p.setAttribute("class", "film-extras__no-data");
      const text = document.createTextNode("No data for Vehicles");
      p.appendChild(text);
      div.appendChild(p);
    }

    return div;
  }

  createLocationsCards( locations: ILocations[] ): HTMLDivElement {
    //.film-extras__no-data
    const div = document.createElement("div");
    div.setAttribute("class", "film-extras__body");

    // we will introduce some data regardless
    if (locations.length > 0) {
      locations.forEach(location => {
        const article = document.createElement("article");
        article.setAttribute("class", "extras-card");

        const h3 = document.createElement("h3");
        h3.setAttribute("class", "extras-card-title")
        h3.appendChild(this.textNode(location.name));

        const ul = document.createElement("ul");
        const cname = "extras-card-list__item"
        ul.setAttribute("class", "extras-card-list")
        ul.appendChild(this.liElement("Climate: ", location.climate, cname));
        ul.appendChild(this.liElement("Terrain: ", location.terrain, cname));
        ul.appendChild(this.liElement("Surface water: ", location.surface_water, cname));
        ul.appendChild(this.liElement("Residents: ", location.residents.join(", "), cname));

        article.appendChild(h3);
        article.appendChild(ul);

        // all goes in here
        div.appendChild(article);
      });
    }else{
      const p = document.createElement("p");
      p.setAttribute("class", "film-extras__no-data");
      const text = document.createTextNode("No data for Locations");
      p.appendChild(text);
      div.appendChild(p);
    }

    return div;
  }
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

    // load film details
    this.loadFilm();

    // TODO: load film extras
    this.loadFilmExtras();
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

    // PEOPLE
    const peopleData = await this.fetchData("people");
    // species will only server to get the persons species name
    const speciesData = await this.fetchData("species");
    let people: IPeople[];

    // are we able to dig deeper into people
    if (peopleData !== "error") {
      people = peopleData.filter((person) => {
        // check for matching film id

        return person.films.some((url) => {
          // lets populate the species property. url === filmURLID
          if (url === filmURLID) {
            // give it a default value in case API does not provide one
            person.species = "unavailable";

            if (speciesData !== "error") {
              // search species for match
              for (let specie of speciesData) {
                // we just need the name of specie
                if (specie.url === person.species) {
                  person.species = specie.name;
                  break;
                }
              }
            }

            // if we hit this, we found a person for this movie
            return true;
          }
        });
      });

      // store the people
      this.#model.people = people;
    }else{
      missingExtras.push("people");
    };

    // VEHICLES
    const vehiclesData = await this.fetchData("vehicles");
    let vehicles: IVehicles[];

    // are we able to dig deeper into vehicles
    if (vehiclesData !== "error") {
      vehicles = vehiclesData.filter((vehicle) => {
        // check for matching film id
        return vehicle.films.some((url) => {
          
          // find vehicles in this film
          if (url === filmURLID) {
            // default value for pilot in case we cant find their name

            if (peopleData !== "error") {
              const pilot = vehicle.pilot;

              // default incase we cant find it amongst the people
              vehicle.pilot = "not available";

              // traverse all people looking for pilot
              for (let person of peopleData) {
                if (person.url === pilot) {
                  vehicle.pilot = person.name;
                  break;
                }
              }
            }

            // we found pilot
            return true;
          }

        });
      });

      // store the vehicles
      this.#model.vehicles = vehicles;
    }else{
      missingExtras.push("vehicles");
    };

    // LOCATIONS
    const locationsData = await this.fetchData("locations");
    let locations: ILocations[];
    
    // are we able to dig deeper into locations
    if (locationsData !== "error") {
      locations = locationsData.filter((location) => {
        
        // populate with locations from this film
        return location.films.some((url) => {
          if (url === filmURLID) {
            
            // create list of residents on this film
            if (peopleData !== "error") {

              // go through each resident and match them to a person
              location.residents.forEach((resident, index) => {

                // reset the list of residents to zero
                if (index === 0) location.residents = [];
                // look through the people for a match
                for (let person of peopleData) {
                  if (person.url.includes(resident)) {
                    location.residents.push(person.name);
                    // no need to keep looking through people
                    break;
                  }
                }

              });

            }

            // a location for film found, add to list
            return true;

          }
        });
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
