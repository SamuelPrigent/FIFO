# React / NodeJS

### Description

- Explore a FIFO (First In, First Out) queue system implemented in this project, where you can enqueue different types of actions for execution.
- Every 1-sec, next action is executed and costs 1 credits (actionA uses creditsA, action B uses creditsB, etc).
- Every 25-sec, credits are regenerated within a range of 80-100% of their maximum value.

### If You Want To Add New Types Of Actions

- Everything in the project (front, back, and tests) is design to scale :
- Edit `allType` in both backend/src/constants and frontend/src/constants
- Refresh the page (and server will auto restart with nodemon).

## Configuration of Local Database

- This guide explains how to configure your machine to use a local database with MongoDB Compass : [MongoDB Documentation](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-base-config)
- **Create two databases : "fifo" and "fifo_test"**. They correspond to the environment variables in backend (.env) file: `MongoURL` and `MongoURL_test`.

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

> Required: Node.js v21.6+.

- Navigate to the backend folder
- Execute `npm install`
- Execute `npm run build`
- Execute `npm run dev`
- Listening on port 3000
- Working on backend ? use `npm run watch`, which compiles your code automatically on changes.

## Run Backend Tests

- Navigate to the backend folder
- Cancel `npm run dev` processus
- Use `npm run test`
