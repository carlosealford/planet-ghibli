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
  url: string;
}

interface ISharedEntity {
  id: string;
  name: string;
  films: string | string[];
  url: string;
}

export interface IVehicles extends ISharedEntity {
  description: string;
  vehicle_class: string;
  length: string;
  pilot: string | string[];
}

export interface ISpecies extends ISharedEntity {
  classification: string;
  eye_colors: string;
  hair_colors: string;
  people: string | string[];
}

export interface IPeople extends ISharedEntity {
  gender: string;
  eye_color: string;
  hair_color: string;
  species: string | string[];
}

export interface ILocations extends ISharedEntity {
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string | string[];
}

// used by the Home Controller
export type TFilmsView = Pick<IFilm, "id" | "title" | "image">;

export type TFetchedData = {
  status: "ok" | "error",
  data: string | TFilmsView,
}