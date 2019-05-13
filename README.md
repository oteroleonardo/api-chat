# api-chat
A simple demo of a chat API

# Dependencies:

* Node.js >= 11.12.00
* Docker
* knex.js (this is optional to create db model and run migrations) npm install -g knex

# First things first:
This API chats depends on a PostgreSQL DB already running in your localhost. If that's not your case you can still use a provided docker container with PostgreSQL.
So to launch the chat API just execute the following 3 command in the the project root:

```bash
> npm i
> docker-compose up -d   (optional to start as daemon a PostgreSQL container)
> npm run demo
> docker-compose stop    (optional to stop PostgreSQL container)
```

If everything works well that should first install dependencies, launch a DB container and finally the api-chat.

In case you want to test the API check [test/bdd/api-chat.postman_collection.json](test/bdd/api-chat.postman_collection.json) which is Postman collection.

Solution design consideration (just spanish sorry ;) ) [doc/design.md](doc/design.md)

Enjoy the ride!
