[![License](http://img.shields.io/:license-apache%202.0-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![User chat](https://img.shields.io/badge/chat-users-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302529-users)
[![Developer chat](https://img.shields.io/badge/chat-devs-brightgreen.svg)](https://debezium.zulipchat.com/#narrow/stream/302533-dev)
[![Google Group](https://img.shields.io/:mailing%20list-debezium-brightgreen.svg)](https://groups.google.com/forum/#!forum/debezium)
[![Stack Overflow](http://img.shields.io/:stack%20overflow-debezium-brightgreen.svg)](http://stackoverflow.com/questions/tagged/debezium)

Copyright Debezium Authors.
Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

# Debezium platform stage

This repository contains a new web-based UI for the Debezium operator. The Stage UI is a React+Typescript-based Single Page Application built with Vite.

<img width="1728" alt="image" src="https://github.com/user-attachments/assets/8888e4cb-2275-40a6-8c03-819c1020c868">


<img width="1728" alt="image" src="https://github.com/user-attachments/assets/ddaa3d33-f367-4993-aa9c-bd754d276b6f">




This project is under active development, any contributions are very welcome.

## Requirements
node (version 20.x.x or higher) and yarn (version 1.22.x or higher).

## Quick-start

### Running UI app locally

To quickly start react app locally. 

```bash
git clone https://github.com/indraraj/stage-chakra
cd stage-chakra
yarn && yarn dev
```

Stage UI will be available on [http://localhost:5173](http://localhost:5173)  

## Running UI app with backend via docker

### DEV Infrastructure with Docker-Compose

```bash
git clone https://github.com/indraraj/stage-chakra
cd stage-chakra
```

You can set up a running DEV infrastructure with platform-conductor and Postgres using docker compose:

```
## start containers
$ docker compose up -d
```
    
Platform conductor REST API will be available on local port **8080**.   
Postgres will be available on local port **5432**.   
Platform Stage UI will be available on [http://localhost:3000](http://localhost:3000) 

### Cleanup

later stop running containers.

```
$ docker compose down

```

## UI Development

Install all the dependencies
```bash
yarn
```

Running UI web app targeting local dev setup 
```bash
VITE_BACKEND_BASE_URL={backend_URL} && yarn dev
```

Debezium UI will be available on [http://localhost:5173](http://localhost:5173)  

## Development scripts
```sh
# Install development/build dependencies
yarn

# Start the development server
yarn dev

# Run a production build (outputs to "dist" dir)
yarn build

# Run the test suite
yarn test

# Run the linter
yarn lint

# Start the dev server (run a production build first)
yarn preview
```

## Contributing

The Debezium community welcomes anyone that wants to help out in any way, whether that includes
reporting problems, helping with documentation, or contributing code changes to fix bugs, add tests,
or implement new features.
See [this document](https://github.com/debezium/debezium/blob/main/CONTRIBUTE.md) for details.
