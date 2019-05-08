FROM node:11.12.0-alpine
RUN mkdir /code
WORKDIR /code
COPY . /code
RUN rm -rf /code/node_modules
RUN apk --no-cache --virtual build-dependencies add python make g++ 
RUN npm install
RUN apk del build-dependencies
RUN npm install knex -g
RUN echo 'Running latest DB migration'
EXPOSE ${PUBLIC_PORT}
CMD ["npm", "start"]
