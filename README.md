# Cure Viz

Cure Viz is a simple web app for viewing and sharing dashboards that are built using a simple dashboard templating language built into Cure.

Dashboards can be shared via query string(!), Gist, remotely hosted, or uploaded manually and can be temporarily viewed and/or persisted to local storage. This
allows for no central server to be required, just host the web app, share your dashboard content and it is ready to go. Zero cost, zero logins, zero personal information.

Over time, more visualisation and layout options will be added, but for now the following are available (but lets be honest, you *probably* don't need more, if you do there are better tools):

- Charts: bar, line, pie, scatter (multi-chart supported)
- Table: filterable, paged
- Markdown

See an example dashboard below:

![cure-viz](https://github.com/williamthom-as/cure-viz/assets/8381190/5552e178-0f43-4b58-9335-0f28456d7107)

### Why?

Cure Viz was built as I wanted to take the results from analysing a CSV and visualise/share the insights quickly, at no cost. Yes, lots of other tools exist to do this. Yes, they are more powerful... but most are unnecessarily complex for my needs and either have a cost to use, or a cost to host your own. I don't want server and database bills, I want to generate the dashboard and share it in seconds. Currently, I use S3 to host and it's a few cents a month; why not use Gist or the query string to hold my data?

### Templates

[Cure](https://github.com/williamthom-as/cure) comes with built in support to export directly to Cure Viz, but any tool would work. The dashboard definition is just JSON, it's so simple you could even hand type one 😊. 

Note: I don't plan on writing another library to support X language. But, if you wanted to, it would be trivial. You can see the Ruby library [here](https://github.com/williamthom-as/cure/blob/main/lib/cure/viz/viz_base.rb), with example.

## Hosting Methods

Cure currently supports three methods to retrieve dashboard data, you can:

1. Directly upload it to the app, which is then persisted to your browsers local storage. This is not directly shareable to other users.
2. Upload the template to Gist (https://gist.github.com). You can either directly add it to local storage, or just check it out at `https://<my_hosted_cure_app.com>/dashboard/viewer/remote?gistId=<my_gist_id>`. Anyone can use this link.
3. Put it directly in the query string (Base64 encoded), like so `https://<my_hosted_cure_app.com>/dashboard/viewer/remote?encoded=<base64_encoded_template>`.
Some browsers have limits on query strings, so this is not a preferable option, but it is neat.

## Templating

As mentioned, Cure Viz uses a JSON-based format for describing dashboards. You can read more about it [here](https://github.com/williamthom-as/cure).

Alternatively, you can view an example dashboard [here](https://xyare.com/dashboard/viewer/remote?gistId=fbbcb4ba16e3483bc66156d6c8a8dcf8).

## Example

Here is an example in Ruby:

```ruby
require "cure/viz/viz_base"

result = Cure::Viz::VizBase.new(title: "Example")
  .with_description("This is an example")
  .with_author("William")

result.add_table_panel(title: "Test Table") do
  columns(%w[Name Color Age City])
  rows([
     ["alice", "xanadu", 25, "New York"],
     ["xavier", "azure", 30, "Los Angeles"],
     ["emily", "emerald", 22, "Chicago"]
  ])
end

result.add_chart_panel(
  title: "Test Chart",
  chart_type: Cure::Viz::WidgetTypes::BAR_CHART
) do
  labels(%w[Red Blue Yellow])
  dataset("Count", [10, 20, 30])
  dataset("Max", [1, 40, 66])
  options(
    { chart_title: "Colour Count Chart" }
  )
end

puts result.export
```

Exports

```json
{
    "title": "Example",
    "panels": [
        {
            "title": "Test Table",
            "widget_type": "table",
            "data": {
                "columns": ["Name", "Color", "Age", "City" ],
                "rows": [
                    ["alice", "xanadu", 25, "New York"],
                    ["xavier", "azure", 30, "Los Angeles"],
                    ["emily", "emerald", 22, "Chicago"]
                ]
            },
            "options": {}
        },
        {
            "title": "Test Chart",
            "widget_type": "bar-chart",
            "data": {
                "labels": ["Red", "Blue", "Yellow"],
                "datasets": [
                    { "label": "Count", "data": [10, 20, 30] },
                    { "label": "Max", "data": [1, 40, 66] }
                ],
                "options": {
                    "chart_title": "Colour Count Chart"
                }
            },
            "options": {}
        }
    ],
    "description": "This is an example",
    "author": "William"
}
```

In Base64:

```
eyJ0aXRsZSI6IkV4YW1wbGUiLCJwYW5lbHMiOlt7InRpdGxlIjoiVGVzdCBUYWJsZSIsIndpZGdldF90eXBlIjoidGFibGUiLCJkYXRhIjp7ImNvbHVtbnMiOlsiTmFtZSIsIkNvbG9yIiwiQWdlIiwiQ2l0eSJdLCJyb3dzIjpbWyJhbGljZSIsInhhbmFkdSIsMjUsIk5ldyBZb3JrIl0sWyJ4YXZpZXIiLCJhenVyZSIsMzAsIkxvcyBBbmdlbGVzIl0sWyJlbWlseSIsImVtZXJhbGQiLDIyLCJDaGljYWdvIl1dfSwib3B0aW9ucyI6e319LHsidGl0bGUiOiJUZXN0IENoYXJ0Iiwid2lkZ2V0X3R5cGUiOiJiYXItY2hhcnQiLCJkYXRhIjp7ImxhYmVscyI6WyJSZWQiLCJCbHVlIiwiWWVsbG93Il0sImRhdGFzZXRzIjpbeyJsYWJlbCI6IkNvdW50IiwiZGF0YSI6WzEwLDIwLDMwXX0seyJsYWJlbCI6Ik1heCIsImRhdGEiOlsxLDQwLDY2XX1dLCJvcHRpb25zIjp7ImNoYXJ0X3RpdGxlIjoiQ29sb3VyIENvdW50IENoYXJ0In19LCJvcHRpb25zIjp7fX1dLCJkZXNjcmlwdGlvbiI6IlRoaXMgaXMgYW4gZXhhbXBsZSIsImF1dGhvciI6IldpbGxpYW0ifQo=
```

And finally, we pop it in a query string and you can view it live [here!](https://xyare.com/dashboard/viewer/remote?encoded=eyJ0aXRsZSI6IkV4YW1wbGUiLCJwYW5lbHMiOlt7InRpdGxlIjoiVGVzdCBUYWJsZSIsIndpZGdldF90eXBlIjoidGFibGUiLCJkYXRhIjp7ImNvbHVtbnMiOlsiTmFtZSIsIkNvbG9yIiwiQWdlIiwiQ2l0eSJdLCJyb3dzIjpbWyJhbGljZSIsInhhbmFkdSIsMjUsIk5ldyBZb3JrIl0sWyJ4YXZpZXIiLCJhenVyZSIsMzAsIkxvcyBBbmdlbGVzIl0sWyJlbWlseSIsImVtZXJhbGQiLDIyLCJDaGljYWdvIl1dfSwib3B0aW9ucyI6e319LHsidGl0bGUiOiJUZXN0IENoYXJ0Iiwid2lkZ2V0X3R5cGUiOiJiYXItY2hhcnQiLCJkYXRhIjp7ImxhYmVscyI6WyJSZWQiLCJCbHVlIiwiWWVsbG93Il0sImRhdGFzZXRzIjpbeyJsYWJlbCI6IkNvdW50IiwiZGF0YSI6WzEwLDIwLDMwXX0seyJsYWJlbCI6Ik1heCIsImRhdGEiOlsxLDQwLDY2XX1dLCJvcHRpb25zIjp7ImNoYXJ0X3RpdGxlIjoiQ29sb3VyIENvdW50IENoYXJ0In19LCJvcHRpb25zIjp7fX1dLCJkZXNjcmlwdGlvbiI6IlRoaXMgaXMgYW4gZXhhbXBsZSIsImF1dGhvciI6IldpbGxpYW0ifQo=)

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


