<h1 align="center"> Webhooks Microservice API </h1> <br>
<p align="center">
  <a href="">
    <img alt="Webhooks Microservice API" title="Webhooks Microservice API" src="docs\assets\logo.png" width=250>
  </a>
</p>
<br />
<p align="center">
  WebHooks Microservice. Built with NodeJs
</p>


<p align="center">
<img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/>
&nbsp;&nbsp;&nbsp;
<img alt="Moleculer" src="https://badgen.net/badge/Powered%20by/Moleculer/0e83cd"/>
&nbsp;&nbsp;&nbsp;
<img alt="Docker" src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
</p>

# Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Features](#features)
- [Instructions to run](#instructions-to-run)
  - [Install](#install)
  - [Start locally](#start-locally)
  - [Start in Docker](#start-in-docker)
  - [Running as microservices](#running-as-microservices)
  - [Development locally](#development-locally)
- [Tasks](#tasks)
- [Development](#development)
  - [1. Product](#1-product)
  - [2. Helper /Tester](#2-helper-tester)
- [Product](#product)
  - [Services](#services)
  - [Resources](#resources)
- [moleculer-micro](#moleculer-micro)
  - [Usage](#usage)
  - [Useful links](#useful-links)
- [NPM scripts](#npm-scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This is a Implementation Webhooks Service using `Moleculer` ( Progressive microservices framework for Node.js. ) and `Express` ( Back-End for Node.js )   

## Features

- Register, Update, Delete, and List  Web-Hooks
- URL Validation on Web-Hooks
    - on Register
    - on Update
- Concurrent Requests


## Instructions to run
### Install
```bash
git clone https://github.com/Swarag-N/DyteMicroServiceTask.git
cd DyteMicroServiceTask
```

### Start locally
To start locally, you need to running a MongoDB server on localhost.
```bash
npm install
npm start
```

**Open the [http://localhost:3000/](http://localhost:3000/) URL in your browser.**


###  Start in Docker

Running as microservices
_All services are running in separated containers, communicate via NATS & use Traefik reverse proxy._

```bash
npm run dc:up
```
**Open the http://docker-machine:3000/ URL in your browser.**


### Development locally
_Running MongoDB is required on localhost!_

```bash
npm run dev
```
### Target Server
_Basic HTTP Servers to capture the response_

```bash
npm run targets
```
- Open the http://localhost:4000/ URL in your browser.
- Open the http://localhost:4001/ URL in your browser.
- Open the http://localhost:4002/ URL in your browser.
- Open the http://localhost:4003/ URL in your browser.
- Open the http://localhost:4004/ URL in your browser.

## Tasks

- [x]  Collect Info
    - [x]  Molecular
- [x]  Understand Problem Statement
- [x]  Development
- [X] DB Seed
- [x] Add WebHook Servers 

## Development

Two Servers 

1. Microservice App to Store and Trigger WebHooks
2. Web-Hooks Receiver

### 1. Product

1. API Gateway
2. DB
3. Message Broker
4. Web-Hook Initiator
5. Admin Board

### 2. Helper /Tester

1. Listens for Requests
2. Development Dependences  
    1. Axios
    2. Logger - Morgan

## Product
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **webhooks**: Service with actions to register and create triggers on webHooks.
### Services

Microservice using Moleculer Framework with a Backend using Express framework implemneted 
Webhooks funtionality 

Check `docs\demo.md`

- [x]  `API Service`
    - [x]  Routes `admin`
        - [x]  Create : `/register`
        - [x]  Read   :  `/list`
        - [x]  Update: `/update`
        - [x]  Delete:  `/delete`
    - [x]  Trigger `/ip`
        - [x]  Calls the **`trigger`** action exposed by the **`webhooks microservice`**.
- [x]  **`webhooks microservice`**
    - [x]  Actions
        - [x]  **`webhooks.register`**
        - [x]  **`webhooks.list`**
        - [x]  **`webhooks.trigger`**
        - [x]  **`webhooks.update`**
        - [x]  **`webhooks.delete`**
    - [x]  Methods
        - [x]  Concurrent API Request
- [x]  Bonus
    - [x]  **`webhooks.trigger`  Retry**
    - [x]  `Dockerize` the Backend and the Moleculer microservice
    - [x]  WebHook Target URL Validation

### Resources

[Dyte Problem Statements](https://docs.google.com/document/d/1iI_rj9f-WCPZOr6DusCdmYacxpXRXt3WwYoYMm421Kg/edit)

[An Introduction to Moleculer JS](https://www.youtube.com/watch?v=t4YR6MWrugw)

[moleculerjs/moleculer-examples](https://github.com/moleculerjs/moleculer-examples)

[What are webhooks?](https://zapier.com/blog/what-are-webhooks/)


## moleculer-micro
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)
### Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.


### Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
