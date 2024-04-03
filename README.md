# React + NodeJS

## Configuration of Local Database

- This guide explains how to configure your machine to use a local database with MongoDB Compass : [MongoDB Documentation](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-base-config)
- **Create two databases : "waalaxy" and "waalaxy_test"**. They correspond to the environment variables in backend (.env) file: `MongoURL` and `MongoURL_test`.

Run MongoDB Compass (on MacOS):

- to start MongoDB server run `brew services start mongodb-community@7.0`
- to stop MongoDB server run `brew services stop mongodb-community@7.0`

## .env configuration

- You dont have to change `MongoURL` and `MongoURL_test` in backend (.env) if you named your databases as mentioned in previous section.
- `PORT` and `VITE_API_PORT` respectively from backend (.env) and frontend (.env) have to be the same.

## Run Frontend

- Navigate to frontend folder
- Execute `npm install`
- Execute `npm run dev`
- Listening on port 5173

## Run Backend

- Navigate to the backend folder
- Execute `npm install`
- Execute `npm run dev`
- Listening on port 3000
- After any change run a new build with `npm run build` to compile

## Run Backend Tests

- Navigate to the backend folder
- use `npm run test`
