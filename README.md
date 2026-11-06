# Gather — Event Management Website

## About

Gather is a student project for browsing local events and registering for one. It uses HTML, CSS, and JavaScript to display event cards, search and filter events, show event details, validate registration details, and display a confirmation.

## Features

- Responsive layout for phones, tablets, and desktops
- Event search and category filters
- Event details and registration form
- Name, email, and phone validation
- Light/dark theme toggle
- Local Storage for saved events, registrations, and theme choice

## Project files

- `index.html` — page structure
- `css/styles.css` — styling and responsive layout
- `js/events.js` — sample event information
- `js/app.js` — event display, search, filters, and theme toggle
- `js/registration.js` — form validation and confirmation

## Run locally

No build step is needed. In PowerShell, run this from the project folder to open the page in your default browser:

```powershell
Start-Process .\index.html
```

You can also open `index.html` directly, or use the VS Code Live Server extension. If Node.js/npm is installed and you prefer a local server, `npx --yes serve .` is another option.

## Deploy with Vercel

1. Push the project to GitHub.
2. In Vercel, select **Add New → Project** and import the repository.
3. Choose **Other** as the framework preset and keep the root directory at the folder containing `index.html`.
4. Leave the build and install commands blank. If asked, set the output directory to `.`.
5. Select **Deploy**, then test the published URL.

This is a static HTML/CSS/JavaScript site, so it has no build command. See [Vercel's static site build guidance](https://vercel.com/docs/builds).

## Notes

The events are sample data in `js/events.js`; update them before submission. Images and fonts load from external providers and need an internet connection. Registrations are saved only in the visitor's browser; they are not sent to an event organizer.


