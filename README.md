# MyPlace App - Frontend

Code-along repo for Maximillian Schwarzmuller's Udemy course - The MERN Fullstack Guide

> Commits start from Section5: React.js - Building the Frontend

## Deploying a Standalone React SPA with Firebase

- Replace localhost url with the url of the deployed server in `.env.production` file.

```bash
# REACT_APP_BACKEND_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=https://mern-myplace.herokuapp.com/api
```

- Run build

```bash
npm run build
```

- Install `serve` globally to test production build before deploying it.

```bash
npm install -g serve
```

- Go to `build` directory and run `serve` to serve the static assets from the localhost

```bash
cd build
serve
```

- Test the app at the localhost:5000

- If testing was successful, go to the root folder of your app

- Log in to firebase and run init

```bash
firebase login
firebase init
```

- Configure your app to create `.firebaserc`

```
? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter t
o confirm your choices. Hosting: Configure and deploy Firebase Hosting sites

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Create a new project
i  If you want to create a project in a Google Cloud organization or folder, please use "firebase projects:create" instead, and return to this command when you've created the project.
? Please specify a unique project id (warning: cannot be modified afterward) [6-30 characters]:
 marn-myplace
? What would you like to call your project? (defaults to your project ID)
✔ Creating Google Cloud Platform project
✔ Adding Firebase resources to Google Cloud Platform project

🎉🎉🎉 Your Firebase project is ready! 🎉🎉🎉

Project information:
   - Project ID: marn-myplace
   - Project Name: marn-myplace

Firebase console is available at
https://console.firebase.google.com/project/marn-myplace/overview
i  Using project marn-myplace (marn-myplace)

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? build
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? File build/index.html already exists. Overwrite? No
```

- Deploy to firebase

```bash
firebase deploy
```
