# Decisiones de diseño

## La solución cuenta con 3 capas:

- Ruteo: Ver route/index.js
- Controladores: Ver controller/[user.js/message.js]
- Persistencia: Ver model/[user.js/message.js]

## También se cuenta con funcionalidades de migration/seeding que permiten reiniciar la base y popularla con datos de pruebas

Ver migrations/*.js y seeds/*.js

## La solución emplea Docker para facilitar el uso de PostgreSQL

Ver docker-compose.yml y Dockerfile


## Librarias utilizadas

- bcrypt: Permite cifrar el token JWT
- bookshelf: ORM que facilita la persistencia
- bookshelf-secure-password: Permite utilizar passwords hasheadas (one way)
- chalk: Permite usar colores en log toque facilita la interpretación del log (ej. Red: error, yellow: Advertencia, green/white: log normal)
- cookie-parser: Permite recuperar propiedades almacenadas como cookies en el browser
- debug:  Permite controlar que secciónes de la aplicación pueden generar log
- dotenv: Permite manejar variables de ambiente desde archivos .env 
- express: Permite implementar un servidor http/https con multiples rutas y soporta multiples middlewares que permiten agregar comportamiento transversal
- http-errors: Manejador de errores empleado por Express.js permite capturar errores no manejadas en campas previas
- jade: Default HTML template manager usado por Express.js
- jsonwebtoken: Simplifica la creación de JWT tokens
- knex: Simplifica el acceso a DBs a la vez que permite utilizar queries SQL
- morgan: Middleware Logger utilizados para loguear las request http
- nodemon: Utilizado para recargar la aplicación luego de cada cambio en el código fuente - acelerando el proceso de desarrollo
- passport: Middleware con multiples estrategias (ej. JWT strategy) utilizado para dar seguridad a la aplicación 
- passport-jwt: Estrategia JWT para passport 
- pg: Modulo encargado de permitir la conectividad con PostgreSQL
