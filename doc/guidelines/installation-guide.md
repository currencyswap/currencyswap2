# Installation for development environment

## Set up datasource

```sh
$ cp src/server/datasources.json.template src/server/datasources.json 
```
Edit __src/server/datasources.json__ to adapt with your environment

## Set up application config 

```sh
$ cp src/app-config.json.template src/app-config.json
```

Edit __src/app-config.json__ to adapt with your environment

## Set up the application

### For Ubuntu

```sh
$ cd src
$ npm install
$ scripts/setup.sh
```
### For Windows

```sh
$ cd src
$ npm install
$ node ./bin/setup.js
```

