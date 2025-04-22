# Planet Ghibli 🌏

A site to explore the world Ghibli. From characters to vehicles and places.

## Features

- Mobile friendly
- Use of modals

## Tech stack

**Frontend:**

- HTML5
- CSS
- JavaScript

**Backend:**

- Webpack
- Express to run local server
- nodemon restarts server when changes are made to server-side code
- NPM
- Studio Ghibli API

## Screenshots

![Planet Ghibli screenshot](screenshot.png "Screenshot")

## Run Locally

Clone the project

```bash
git clone https://github.com/carlosealford/planet-ghibli.git
```

Go to the project directory

```bash
cd planet-ghibli
```

Install dependencies

```bash
npm install
```

Build the project locally

```bash
npm run build
```

Start the server

- listens to changes to javascript files and stylesheets only.
- to view HTML changes you have to manually reload the browser.

```bash
npm run dev
```

## Color reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Almost white | ![#f4faf6](https://via.placeholder.com/10/f4faf6?text=+) #f4faf6 |
| Honeydew | ![#dceee1](https://via.placeholder.com/10/dceee1?text=+) #dceee1 |
| Jade | ![#50A967](https://via.placeholder.com/10/50A967?text=+) #50A967 |
| Cal poly green| ![#285534](https://via.placeholder.com/10/285534?text=+) #285534 |
| ucla blue | ![#4F759B](https://via.placeholder.com/10/4F759B?text=+) #4F759B |
| Ultra violet | ![#5D5179](https://via.placeholder.com/10/5D5179?text=+) #5D5179 |

## Key takeaways

I have neve had the need to use webpack and I can see the appeal but the initial setup is a bit long winded.
However once it is setup I do like how you can tell it in which order to pip through each step required for the project.
You can lint, before minifiying and then creating the files required to launch the site. The separation of concerns is lovely.

The other topic I practice is MVC, Model, View, and Controller framework. Another way to separate concerns.
It focuses on seprating the app data storage from presentation and user actions.

Using both `express` and `nodemon` together to watch for changes made to Javascript and Stylesheets.
There is a common plugin that we can add to also force reload on HTML changes, however it is not needed with this project because once the HTML structure is set we will not be making changes to it. Data is being pulled dynamically via the API using JS.

## Roadmap

**MVP**

- Home page that shows all the films in chronological order
- Each film is a link to further details about the film
- Film details page
- Film information release date, running time, director, and producer
- Modals to showcase the film people, species, locations and vehicles

**Version 1.1.0**

- Improve the modals structure so that when its open the user can not interact with anything outside of it.

## Authors

- [Carlos E Alford](https://carlosealford.com)

## Acknowledgements

- [Studio Ghibli API](https://ghibliapi.vercel.app/)
- [Webpack](https://webpack.js.org/)

## Acknowledgements

- [Studio Ghibli API](https://ghibliapi.vercel.app/)
- [Webpack](https://webpack.js.org/)

## License
[GNU General Public License v3.0](License)
