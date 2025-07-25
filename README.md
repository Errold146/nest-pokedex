<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Descripción

## Descargas los modulos de node

```bash
$ yarn install
```

## Tener Nest CLI instalado

```bash
$ npm i -g @nestjs/cli
```

## Levantar la base de datos
```bash
$ docker-compose up -d
```

## Compilar y ejecutar el proyecto

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Insertar registros en la base de datos
```bash
$ http://localhost:3000/api/v2/seed
```