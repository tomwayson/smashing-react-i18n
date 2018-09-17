
This fork is for testing out react-intl against requirements for a specific app.

In addition to the features described below, this repo demonstrates how to:
- [x] detect the user's locale on the client (i.e. if not passed in a cookie from the server)
- [x] test components w/ [jest](https://jestjs.io/)/[enzyme](https://github.com/airbnb/enzyme)
- [x] lazy load components and their messages at runtime
- [ ] TODO: run the app w/o server-rendering

Everything below comes from the upstream repo: https://github.com/yury-dymov/smashing-react-i18n

# Internationalizing React App Boilerplate For SmashingMagazine
This is a boilerplate template for the [Internationalizing React Apps article](https://www.smashingmagazine.com/2017/01/internationalizing-react-apps/)

You may also check for the [solution branch](https://github.com/yury-dymov/smashing-react-i18n/tree/solution)

# Under The Hood

* Universal / Isomorphic React App
* Babel
* webpack, webpack-dev-server, and configuration
* express

# Tutorial Steps

1. Implement user's locale detection with `accept-language` library
2. Translate messages with `react-intl`
3. Support locale-specific content like numbers and dates

# License
MIT (c) Yury Dymov
