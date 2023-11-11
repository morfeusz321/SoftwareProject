# Flow Builder for API Integration
The FlowBuilder for API Integration is a project developed during the 2023 Software Project course at the Delft University of Technology in partnership with Insocial B.V. This application aims to simplify the API integration process, enabling non-technical users to connect their company's systems to Insocial's API through an intuitive graphical interface.

The application utilizes PHP and Symfony for the backend and TypeScript with Angular for the frontend.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Analysis](#analysis)
- [Documentation](#documentation)
- [Dependencies](#dependencies)

## Project Structure

The project is organized into two main directories along with other essential files and directories:

- `client/` - This directory contains all necessary files for the Angular frontend application. Key elements include:
  - `angular.json` - Angular workspace file which configures how the Angular CLI builds and serves applications.
  - `cypress/` - Contains files related to Cypress for end-to-end testing.
  - `documentation/` - Generated Compodoc documentation for the Angular application is stored here.
  - `src/` - The source code of the Angular application resides in this directory.
  - `package.json` - Lists the package dependencies for the project.
  - `node_modules/` - Contains the packages necessary for the Angular application that are installed via npm.

- `server/` - This directory houses all files pertinent to the Symfony backend application, including:
  - `Dockerfile` - Describes the Docker image to be used for the backend.
  - `Makefile` - Contains set of directives used by a make build automation tool.
  - `src/` - This directory contains the source code of the Symfony application.
  - `config/` - Symfony application configuration files.
  - `public/` - The public directory of the Symfony application.
  - `composer.json` - The dependency manager file for PHP.
  - `vendor/` - Contains the PHP dependencies installed via composer.

- `docs/` - This directory contains markdown files and pdfs which detail the code of conduct, daily tasks, project outlines, and plans. It also provides a weekly breakdown of the project's progress.

- `README.md` - The file you're currently reading, provides a detailed description of the project, its setup, and usage.

## Requirements

- Docker [(Download here)](https://www.docker.com/)
- Node.js version 16 or higher [(Download here)](https://nodejs.org/en/)
- PHP 7.4 or higher
- Symfony 5.2 or higher
- Composer 2.0 or higher

## Installation

After installing all required dependencies, execute the following commands:

```bash
git clone https://gitlab.ewi.tudelft.nl/cse2000-software-project/2022-2023-q4/cluster-05/5d/flowbuilder-for-api-integration.git
cd flowbuilder-for-api-integration/client
npm install
cd ../server
docker compose build 
```

These commands will install all project dependencies and set up the Docker image for running the backend.

## Running the Application

### Frontend

To start the Angular application, navigate to the `client/` directory and execute:

```shell
npm start
```

The application should be accessible at [http://localhost:4200/](http://localhost:4200/). If any issues arise, consider running the following commands sequentially:

```shell
npm install -g @angular/cli
npm install
ng serve
```

or

```shell
npm run-script ng serve
```

or

```shell
npm start
```

For production mode, utilize the following command:

```shell
npm run start:prod
```

This will switch the Insocial API URL to the production one.

### Backend

To start the Symfony server, navigate to the `server/` directory and execute:

```bash
docker compose up
```

This will run the application's server at http://localhost:90.

## Testing

This project includes unit tests for core Redux store functionality and backend controllers and services, component integration tests, and end-to-end tests for the entire application.

### Unit and Integration Tests

To execute these tests on the frontend, navigate to the `client/` directory and run:

```shell
npm run test
```

This command will run all unit tests on 3 browsers. Additionally, the pipeline tests can be run on Chrome headless with:

```shell
npm run test:ci
```

Coverage reports for the unit tests are located in the 'coverage' folder within the client folder.

To run PHPUnit tests on the backend, execute the following command in the `server/` directory:

```shell
make tests -B
```

### Mutation Tests

**Note:** Running the mutation tests for the frontend requires Stryker package, it should be installed while running `npm install` in the `client/` directory.
But if you encounter errors you can refer to Stryker's [installation guide](https://stryker-mutator.io/docs/stryker-js/getting-started/https://stryker-mutator.io/docs/stryker-js/getting-started/).

To run mutation tests on the frontend, execute the following command in the `client/` directory:
By default the config at `client/stryker.conf.js` will be used. It includes all files in the `client/src/app` directory for mutation testing.
You can also run mutation tests on a single file by specifying the path to the file config
If you encounter any error while running the mutation please remove `.stryker-tmp` folder before running the mutation tests again.
The report of the run should be available in the `client/coverage` folder, named `mutation.html`.

If you have stryker installed globally you can run the mutation tests with:
```shell
stryker run
```
If not you can run the mutation tests with:
```shell
npx stryker run
```

For mutation tests on the backend  we used infection framework. It will generate html report in the server directory.

To run infection on the backend, execute the following command in the `server/` directory:
```shell
make mutation
```

### End-to-end Tests

**Note:** Running end-to-end tests requires the application at [http://localhost:4200/](http://localhost:4200/) and the server at [http://localhost:90/](http://localhost:90/).

To execute the end-to-end tests, use the following command:

```shell
npm run
cypress:run
```

This command runs all end-to-end tests, displays the results, and records test execution. To view the execution in real-time, use the following command to open the Cypress studio:

```shell
npm run cypress:open
```

## Analysis

To analyze the Angular application, execute the following command in the `client/` directory:

```shell
npm run lint
```

For static analysis of the backend code, run:

```shell
make analyze
```

You can view the generated report in `server/myreport.html`.

## Documentation

### Frontend

This project utilizes Compodoc for detailed Angular application documentation. To generate this, navigate to the `client/` directory and execute:

```shell
npm run compodoc:generate
```

This command generates the documentation in the 'documentation' folder within the client folder. Open the 'index.html' file in the 'documentation' folder to view the documentation.

For automatic updates of documentation with code changes, use:

```shell
npm run compodoc:watch
```

This command updates the documentation after each codebase change.

### Backend

API documentation is automatically generated using NelmioApiDocBundle. When the backend is running, access the API documentation at `http://localhost:90/api/doc`.

## Dependencies

Please refer to the `package.json` file in the `client/` directory for a comprehensive list of dependencies.
