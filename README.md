# React + NodeJS

## Configuration of Local Database

This guide explains how to configure your machine to use a local database with MongoDB Atlas:
[MongoDB Documentation](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-base-config)

Exemple on MacOS:

- to start MongoDB server run `brew services start mongodb-community@7.0`
- to stop MongoDB server run `brew services stop mongodb-community@7.0`

## Run Frontend

- Navigate to frontend folder
- Execute `npm run dev`
- Listening on port 5173

## Run Backend Server

- Navigate to the backend folder
- Execute `npm run dev`
- Listening on port 3000

## Run Backend Tests

- use `npm run test`
- test running on their own database
