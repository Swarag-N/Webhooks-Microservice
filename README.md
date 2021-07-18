<h1 align="center"> Webhooks Microservice API </h1> <br>
<p align="center">
  <a href="/">
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
- [Architecture](#architecture)
- [Usage Instructions](#usage-instructions)
  - [Install](#install)
  - [Start locally](#start-locally)
  - [Start in Docker](#start-in-docker)
  - [Development locally](#development-locally)
  - [Target Server](#target-server)
- [Check Routes](#check-routes)
  - [Locally](#locally)
  - [Docker Service](#docker-service)
- [Tasks](#tasks)
- [Development](#development)
  - [1. Product](#1-product)
  - [2. Helper (Tester|Target)](#2-helper-testertarget)
- [Product](#product)
  - [Services](#services)
  - [Actions](#actions)
  - [Resources](#resources)
  - [Useful links](#useful-links)
- [NPM scripts](#npm-scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This is a Implementation Webhooks Service using `Moleculer` ( Progressive microservices framework for Node.js. ) and `Express` ( Back-End for Node.js )   


In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call "webhooks.trigger" --ipadr "192.12.445.55"` - Call the `webhooks.trigger` action with the `ipadr` parameter.

## Features

- Register, Update, Delete, and List  Web-Hooks
- URL Validation on Web-Hooks
    - on Register
    - on Update
- Concurrent Requests

## Architecture
<a href="/">
<img alt="Webhooks Microservice Architecture" title="Webhooks Microservice Architecture" src="docs\assets\Architecture.png" width=800>
</a>

## Usage Instructions

This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)
### Install
```bash
git clone https://github.com/Swarag-N/Webhooks-Microservice.git
cd Webhooks-Microservice
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

## Check Routes

### Locally

- Install Dependencies (Dev and Production)

```bash
npm ci     
```

- Start Target Servers : 5 Http Servers will Start 
    1. PORT [4000 ... 4004] 
    2. Logs the request 
    3. Health Check [`http://localhost:4000/`](http://localhost:4000/)

```bash
npm run targets 
```

- Import Postman collections of API Service from `docs` folder

- Start Service

```bash
npm run dev
```


Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/list URL in your browser. 

`call "webhooks.trigger" --ipadr "192.12.445.55"` - Call the `webhooks.trigger` action with the `ipadr` parameter

o/p
```bash
┌───────────┬─────────────────┐
│  (index)  │     Values      │
├───────────┼─────────────────┤
│   ipadr   │ '192.12.445.55' │
│ timeStamp │  1626537496624  │
└───────────┴─────────────────┘
┌───────────┬─────────────────┐
│  (index)  │     Values      │
├───────────┼─────────────────┤
│   ipadr   │ '192.12.445.55' │
│ timeStamp │  1626537496624  │
└───────────┴─────────────────┘
```

### Docker Service

- Import Postman collections of API Service from `docs` folder

- Start Service

```bash
npm run dc:up
```

NOTE: Local Network is different from Internal Network, give external sites as Input 

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
4. Web-Hook Trigger Initiator


### 2. Helper (Tester|Target)
-  Listens for Requests

## Product
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **webhooks**: Service with actions to register and create triggers on webHooks.
### Services

Microservice using Moleculer Framework with a Backend using Express framework implemneted 
Webhooks funtionality. 

Check `docs\demo.md` for API response for bellow EndPoints 

- [x]  `API Service`
    - [x]  Routes `admin`
        - [x]  Create : `/register` add new webhooks
        - [x]  Read   : `/list` list registerd webhooks
        - [x]  Update : `/update` update registerd webhook
        - [x]  Delete : `/delete` delete registerd webhook
    - [x]  Trigger : `/ip` initate requests to all registerd webhooks    
        - [x]  Calls the **`trigger`** action exposed by the **`webhooks microservice`**.
- [x]  **`webhooks microservice`**
    - [x]  Actions
        - [x]  **`webhooks.register`**
          - [x] URL Validation before registering Webhook
        - [x]  **`webhooks.list`**
        - [x]  **`webhooks.update`**
          - [x] URL Validation before updating Webhook
        - [x]  **`webhooks.delete`**
        - [x]  **`webhooks.trigger`**
          - [x] Initate requests concurrently in batches 

### Actions
<a href="">
    <img alt="Actions of Webhooks Microservice API" title="Actions" src="docs\assets\Actions.png" width=800>
</a>

### Resources

[An Introduction to Moleculer JS](https://www.youtube.com/watch?v=t4YR6MWrugw)

[moleculerjs/moleculer-examples](https://github.com/moleculerjs/moleculer-examples)

[What are webhooks?](https://zapier.com/blog/what-are-webhooks/)


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
