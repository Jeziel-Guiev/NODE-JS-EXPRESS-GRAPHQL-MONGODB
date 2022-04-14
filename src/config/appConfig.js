import dotenv from 'dotenv'; // importamos dotenv para usar las variables de entorno
dotenv.config(); // procesamos los archivos que estan en la carpeta .env

import { ENVIRONMENT } from './environment.js'; // llamamos al archivo environment.js para
//determinar si arrancamos el servidor como desarrollo on en modo produccion


/* Home doc */
/**
 * @file Environment variables configuration for the application
 * @see module:appConfig
 */

/* Module doc */
/**
 * Environment variables configuration for the application
 * @module appConfig
 */

const serverPortByDefault = 3000; // Puerto de nuestro servidor express-graphql
const limitOfUsersRegistered = 0; /* Set the value to 0 to not use the limit. Remember put the same value on the enviroment variables */
// limite para la cantidad de usuarios registrados si lo deja en cero no habra limites para registros de usuarios
/**
 * Environment variables configuration
 * @typedef {Object}
 */
export const environmentVariablesConfig = Object.freeze({ //frezze es propio de javascript lo que hace es bloquear cualquier modificacion de los campos declarados en el objetp
	formatConnection: process.env.MONGO_FORMAT_CONNECTION || 'standard', // Cuando aplicamos una conexion estandar nos referimos algo como esto ejemplo:mongodb://mongodb0.example.com:27017/myDB
	mongoDNSseedlist: process.env.MONGO_DNS_SEEDLIST_CONNECTION || '', // un ejemplo es la siguiente mongodb+srv://server.example.com/myDB esto lo aplicamos en bases de datos semillas, aqui no lo usaremos.
	dbHost: process.env.MONGO_HOST || 'localhost', // host de nuestra base de datos 
	dbPort: process.env.MONGO_PORT || '27017', // puerto por defecto de mongoDB
	database: process.env.MONGO_DB || 'sadosaV1', // nombre de nuestra base de datos
	mongoUser: process.env.MONGO_USER || '', // Autorizacion por usuario y contrasenia por el momento no lo aplicaremos
	mongoPass: process.env.MONGO_PASS || '',
	enviroment: (process.env.ENVIROMENT === ENVIRONMENT.DEVELOPMENT) ? ENVIRONMENT.PRODUCTION : ENVIRONMENT.PRODUCTION, //modificado, arrancaremos en modo produccion 
	port: Number(process.env.PORT) || serverPortByDefault // Puerto de nuestro servidor
}); // exportamos 

/**
 * Security variables configuration
 * @typedef {Object}
 */
export const securityVariablesConfig = Object.freeze({
	secret: process.env.SECRET || 'yoursecret', // Secreto al momento de utilizar JWT para genera nuestro token
	timeExpiration: process.env.DURATION || '2h' // Tiempo de vida de nuestro token dos horas
}); // exportamos 

/**
 * Global variables configuration
 * @typedef {Object}
 */
export const globalVariablesConfig = Object.freeze({
	limitOfUsersRegistered: Number(process.env.LIMIT_USERS_REGISTERED) || limitOfUsersRegistered // limite de usuarios registrados en nuestro caso lo dejamos en cero por lo cual
	// no habra limites al momento de los registros.
});
