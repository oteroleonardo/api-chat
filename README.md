# api-chat
A simple demo of a chat API

# Dependencies:

* Node.js >= 11.12.00
* Docker

# First things first:
This API chats depends on a PostgreSQL DB already running in your localhost. If that's not your case you can still user a provided docker container with PostgreSQL.
So to launch the chat API just execute the following 3 command in the the project root:

```bash
> npm i
> npm run start:docker
> npm run demo
```

If everything works well that should first install dependencies, launch a DB container and finally the api-chat.

Enjoy the ride!
