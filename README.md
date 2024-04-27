# Cure Viz

Cure Viz is a simple web app for creating shareable dashboards. Dashboards can be shared via query string, hosted in a Gist, or uploaded manually.

A dashboard can be viewed or persisted to local storage.

## Run in dev mode, plus watch

    npm start

## Run in production mode, plus watch

It updates index.html with hashed file name.

    npm run start:prod

## Build in dev mode

Generates `dist/*-bundle.js`

    npm run build:dev

## Build in production mode

    npm run build

It builds `dist/*-bundle.[hash].js`, updates index.html with hashed js bundle file name. To deploy to production server, copy over both the generated `index.html` and all the `dist/*` files.

For example
```
index.html
dist/entry-bundle.12345.js
```
Copy to production root folder
```
root_folder/index.html
root_folder/dist/entry-bundle.12345.js
```
## To clear cache

Clear tracing cache. In rare situation, you might need to run clear-cache after upgrading to new version of dumber bundler.

    npm run clear-cache


