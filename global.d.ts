// Ghibli API interface
export interface IFilm {
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
}

export interface IPeople {
  name: string;
  gender: string;
  eye_color: string;
  hair_color: string;
  specie: string;
  classification: string;
}

export interface IVehicles {
  name: string;
  description: string;
  vehicle_class: string;
  length: string;
  pilot: Pick<IPeople, "name">;
}

export interface ILocations {
  name: string;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: Pick<IPeople, "name">[];
}

// used by the Home Controller
export type TFilmsList = Pick<IFilm, "id" | "title" | "image">[];

export type TFilmsData = {
  status: "ok" | "error",
  films?: TFilmsList,
}

// used by Films Controller
export type TFilmURLDirectory = "films" | "people" | "species" | "locations" | "vehicles";

export type TFilmData = {
  status: "ok" | "error",
  film?: IFilm,
}

type IFilmExtras = {
  people: IPeople[];
  locations: ILocations[];
  vehicles: IVehicles[];
}

export type TFilmExtrasData = {
  status: "ok" | "error",
  extras?: IFilmExtras,
}
