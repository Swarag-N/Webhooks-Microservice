[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Tasks

- [x]  Collect Info
    - [x]  Molecular
- [x]  Understand Problem Statement
- [ ]  Development

# Development

Two Servers 

1. Microservice App to Store and Trigger WebHooks
2. Web-Hooks Receiver

## 1. Product

1. API Gateway
2. DB
3. Message Broker
4. Web-Hook Initiator
5. Admin Board

## 2. Helper /Tester

1. Listens for Requests
2. Development Dependences  
    1. Axios
    2. Logger - Morgan
3.  

## Product

### Services

1. Web-Hook Service 
    1. Events 
        - [ ]  Add
        - [ ]  Update
        - [ ]  Delete
        - [ ]  List
        - [ ]  Trigger
    2. Functionalities
        1. On Adding URLs - Santize Input
        2. On Triggering Web-Hooks -  
            1. Max Retries
            2. Handel Errors
1. Admin
    1. Methods
        - [ ]  Add
        - [ ]  Update
        - [ ]  List
        - [ ]  Delete
2. API
    1. Methods

# Resources

[Dyte Problem Statements](https://docs.google.com/document/d/1iI_rj9f-WCPZOr6DusCdmYacxpXRXt3WwYoYMm421Kg/edit)

[An Introduction to Moleculer JS](https://www.youtube.com/watch?v=t4YR6MWrugw)

[moleculerjs/moleculer-examples](https://github.com/moleculerjs/moleculer-examples)

[What are webhooks?](https://zapier.com/blog/what-are-webhooks/)


# moleculer-micro
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.



## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
