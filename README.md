# Oura-sports

Welcome to oura sports, It's a personal sport portofolio project built with NextJS that comes with:

-   An "Adventure" editor which consists of merging photos, gpx activities, enriched text to create blog posts of biking trips I've made
-   Import and enrich strava profile export of activities (manual, no UI for this)
-   An Heatmap of all activities (very slow so far, just a prototype)

🏗️ All of this is still WIP, Website will be released soon 🏗️

# Kudos, technologies used

-   [NextJS](https://github.com/vercel/next.js) & [React](https://github.com/facebook/react) - The base
-   [Mongoose](https://github.com/Automattic/mongoose) - The ORM used to connect to mongodb
-   [react-markdown](https://github.com/remarkjs/react-markdown) & [monaco-editor](https://github.com/microsoft/monaco-editor) - Used to create markdown content and render it allowing me to easelly creating a blog system
-   [Leaflet](https://github.com/Leaflet/Leaflet) - To handle cartography stuff
-   [fit2gpx](https://github.com/dodo-saba/fit2gpx) - To parse strava profile export, converting .fit to .gpx and enriching .gpx files (bundled and edited in this project to handle minor changes)

License MIT © [Mathieu Guyot](https://github.com/mathieuguyot)
