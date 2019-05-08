/* Create DB */
/* CREATE DATABASE ticketera; 
*/

/* Create tables */

DROP TABLE IF EXISTS sector;
CREATE TABLE sector ( 
  id int unsigned not null auto_increment, 
  nombre varchar(40) not null, 
  PRIMARY KEY (id)
  
);

DROP TABLE IF EXISTS user;
CREATE TABLE user ( 
  id int unsigned not null auto_increment, 
  nombre varchar(40) not null, 
  apellido varchar(40) not null, 
  legajo varchar(40) not null, 
  sector int unsigned,  

  PRIMARY KEY (id),
  CONSTRAINT FK_SECTOR_USER FOREIGN KEY (sector)
    REFERENCES sector(id)
    
);

DROP TABLE IF EXISTS ticket;
CREATE TABLE ticket ( 
  id int unsigned not null auto_increment, 
  solicitante int unsigned, 
  responsable int unsigned,
  sector int unsigned,    
  titulo varchar(120) not null, 
  descripcion varchar(512) not null, 
  estado varchar(20) not null, 
  fechaCreacion timestamp NOT NULL default current_timestamp,
  fechaActualizacion timestamp NOT NULL default current_timestamp,

  PRIMARY KEY (id),
  CONSTRAINT FK_TICKET_RESPONSABLE FOREIGN KEY (responsable)
  REFERENCES user(id),
  CONSTRAINT FK_TICKET_SOLICITANTE FOREIGN KEY (solicitante)
  REFERENCES user(id),
  CONSTRAINT FK_TICKET_SOCTOR FOREIGN KEY (sector)
  REFERENCES sector(id)
);


/* Populate tables */
INSERT INTO sector (nombre ) VALUES 
( 'Ventas' ),
( 'Finanzas' ),
( 'Marketing' ),
( 'Administración' ),
( 'Legales' ),
( 'IT' );

INSERT INTO user (apellido, nombre, legajo, sector ) VALUES 
( 'Nieto', 'Benjamin', "1234", 1 ),
( 'Sanchez', 'Luis', "1235", 1 ),
( 'Zanni', 'Erik', "1236", 2 ),
( 'Olmedo', 'Walter', "1237", 3 ),
( 'Rossman', 'Frank', "1238", 4 ),
( 'Perez', 'John', "1239", 2 ),
( 'Polansky', 'Roman', "1240", 5 ),
( 'Rossen', 'David', "1241", 6 );


INSERT INTO ticket (titulo, descripcion, estado, responsable, sector, solicitante) VALUES 
( 'Fallo impresora ventas', 'La impresora de ventas no funciona', 'pendiente', 7, 1, 1 ),
( 'Fallo impresora ventas', 'La impresora de ventas tiene papel trabado', 'pendiente', 1, 1, 1 ),
( 'Mo puedo ingresar al sistema de legales', 'Lex doctor me dice que el usuario no esta registrado', 'pendiente', NULL, 5, 3 );
