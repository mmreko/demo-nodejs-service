# demo-nodejs-service

A demo NodeJS service with authentication and authorization using JWT.

Offers a choice between:

* Static data store
* MongoDB database (with or without schema)
* MySQL database

Uses a Redis database for session storage.

Covered with unit and integration tests.

## How to run

Create a .env file with the following environment variables:

* HOST='localhost'
* PORT=4000
* ENV='dev'
* DATA=['static'|'mysql'|'mongo'|'mongo-schema']
* MONGO_DB_HOST='mongodb://localhost'
* MONGO_DB_PORT=27017
* MONGO_DB_NAME='demo'
* MYSQL_DB_LIMIT=10
* MYSQL_DB_HOST='localhost'
* MYSQL_DB_USER=your-username
* MYSQL_DB_PASSWORD=your-password
* MYSQL_DB_NAME='demodb'
* KEY=your-key
* SALT_ROUNDS=10
* SESSION_SECRET=your-session-secret
* SESSION_TTL=600000
* REDIS_HOST='localhost'
* REDIS_PORT=6379
* REDIS_TTL=260
  
 To run the service, execute `npm start`.
 
 To run the service for development, execute `npm run dev`.
 
 To run the tests, execute `npm run test`.
