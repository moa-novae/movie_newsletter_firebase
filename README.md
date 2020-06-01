# Movie Newsletter Firebase

This repo is for the backend of the Movie Newsletter project. Upcoming movies can be filtered by casts, directors, genres and production company, as chosen by users. The list of filtered movies is then emailed to subscribers on a monthly basis.

The front end repo of the project is [here](https://github.com/moa-novae/movie_newsletter).

User information and preferences are stored on [Cloud Firestore](https://firebase.google.com/docs/firestore).
Info of upcoming movies is obtained from the [Tmdb API](https://developers.themoviedb.org/3/getting-started/introduction). Emails are composed with the help of [MJML](https://mjml.io/), templated with [Handlebars](https://handlebarsjs.com/) and finally sent via [SendGrid v3 API](https://sendgrid.com/docs/API_Reference/api_v3.html).
[Node schedule](https://www.npmjs.com/package/node-schedule) is responsible for scheduling when the emails are sent (first day of each month).


Currently the backend is deployed on Heroku. To start sending monthly emails, run

```bash
yarn herokuSendMonthlyMovies

```
