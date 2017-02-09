# Angular-Universal-Dotnet-Starter

This project was generated with [universal-cli](https://github.com/devCrossNet/universal-cli) version 1.0.0-alpha.universal.3.

This implementation replaces the default Express-based server-side rendering solution with one using the .NET Core runtime. While the pre-rendering application can be run on its own, it has been configured to be hosted via a reverse-proxy between IIS and its Kestrel server. Refer to [this page](https://docs.microsoft.com/en-us/aspnet/core/publishing/iis) for more information about publishing .NET Core apps to IIS.

## Setup

0. Install the [.NET Core SDK](https://www.microsoft.com/net/core).
0. Install the [Angular Universal CLI](https://github.com/devCrossNet/universal-cli).
0. Clone this repo.
0. Run `npm install` in the project directory. This will install both the npm and .NET Core dependencies.

## Development server
Run `ung serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ung generate component component-name` to generate a new component. You can also use `ung generate directive/pipe/service/class`.

## Build

Run `ung build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ung test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ung e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ung serve`.

## Deploying to IIS

Run `npm run build` to build the Angular app and publish the prerendering application. Then, copy the contents of `dist` to your IIS server and configure it as an application.

## Further help

To get more help on the `universal-cli` use `ung --help` or go check out the [Universal-CLI README](https://github.com/devCrossNet/universal-cli/blob/master/README.md).
