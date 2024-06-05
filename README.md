# Cure Viz

Cure Viz is a simple web app for creating and viewing shareable dashboards that are built using the dashboard templating language built into Cure. 

Dashboards can be shared via query string (hosted in a Gist or remotely accessible), or uploaded manually and can be viewed or persisted to local storage. This
allows for no central server to be required, just host the web app and it is ready to go.

Over time, more visualisation and layout options will be added, but for now the following options are available:

- Charts: bar, line, pie, scatter (multi-chart supported)
- Table: filterable, paged
- Markdown

## Templating

As mentioned, Cure Viz uses a JSON-based format for describing dashboards. You can read more about it [here](https://github.com/williamthom-as/cure).

Alternatively, you can view an example dashboard [here](https://xyare.com/dashboard/viewer/remote?gistId=fbbcb4ba16e3483bc66156d6c8a8dcf8).

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


