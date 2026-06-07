/* ===========================================
 * Ghibli API interface
 * =========================================== */
export interface IAPIFilm {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised: string;
  image: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  people: string[];
  species: string[];
  locations: string[];
  vehicles: string[];
  url: string;
}

interface APICommonFields {
  id: string;
  name: string;
  films: string[];
  url: string;
}

export interface IAPIPeople extends APICommonFields {
  gender: string;
  age: string;
  eye_color: string;
  hair_color: string;
  species: string;
}

export interface IAPIVehicles extends APICommonFields {
  description: string;
  vehicle_class: string;
  length: string;
  pilot: string;
}

export interface IAPILocations extends APICommonFields {
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string[];
}

// we only use it to get the name of species
export interface IAPISpecies extends APICommonFields {
  classification: string;
  eye_color: string;
  hair_color: string;
  people: string;
}

// the API categories available
export type TFilmURLDirectory = "films" | "people" | "species" | "locations" | "vehicles";

/* ===========================================
 * HOME PAGE CONTROLLER
 * =========================================== */
export type TFilmsList = Pick<IAPIFilm, "id" | "title" | "image">[];

// used by the Home View for rendering the display
export type TFilmsData = {
  status: "ok" | "error",
  films: TFilmsList | [],
}

/* ===========================================
 * FILM PAGE CONTROLLER 
 * =========================================== */
export type TFectchStatus = "ok" | "partial" | "error";

// API data type for storing film in model
export interface IFilm {
  title: string;
  original_title: string;
  original_title_romanised: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
}
export type TFilm = IFilm | Record<PropertyKey, never>;

// passed on to the view for rendering Film
export type TFilmData = {
  status: TFectchStatus,
  film: TFilm,
}

// API data type for storing film EXTRAS in model
export interface IPeople {
  name: string;
  age: string;
  gender: string;
  eye_color: string;
  hair_color: string;
  species: string;
}

export interface IVehicles {
  name: string;
  description: string;
  vehicle_class: string;
  length: string;
  pilot: string;
}

export interface ILocations {
  name: string;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string[];
}

type IFilmExtras = {
  people: IPeople[];
  locations: ILocations[];
  vehicles: IVehicles[];
}

// expected API types
export type TAPIResponse = {
  films: IAPIFilm;
  people: IAPIPeople[];
  vehicles: IAPIVehicles[];
  locations: IAPILocations[];
  species: IAPISpecies[];
}

// passed on to the view for rendering Extras.
// "error" unable to fetch any extra
// "partial" unable to fetch at least 1 extra
// "ok" all extras fetched responsably
export type TMissingFilmExtras = Array<"people" | "vehicles" | "locations" | "species" | "">
export type TFilmExtrasData = {
  status: TFectchStatus,
  missing: TMissingFilmExtras,
  extras: IFilmExtras,
}
