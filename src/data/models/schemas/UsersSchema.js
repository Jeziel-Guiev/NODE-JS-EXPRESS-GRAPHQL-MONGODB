import mongoose from 'mongoose'; // importamos mongoose
import bcrypt from 'bcrypt';  // librearia para encriptar contrasenias
//import { randomUUID } from 'crypto'; // elimno esta linea de codigo por motivo que el modulo crypto esta discontinuado por lo tanto no tiene soporte

const Schema = mongoose.Schema; // creamos un schema para nuestra base de datos

/**
 * Users schema
 * @constructor Users model constructor
 * @classdesc User have interesting properties. Some of them are isAdmin (false by default), isActive (true by default. Useful for removing login permission to the registered users), uuid (random and unique token. Created to provided a random identifier token for every user different than _id native MongoDB value)
 */
 

// Nuestro usuario tendra un emaill,password,habilidades y role/ isAdmin es propio del Repo
const UsersSchema = new Schema({
	name: {
		type: String, // Tipo String
		required: true, // Es requerido si no se pasa este dato dara error al guardar
	},
	email: {
		type: String, // Tipo String
		required: true, // Es requerido si no se pasa este dato dara error al guardar
		unique: true, // Debe ser unico si se encuentra otro repetido dara error al guardar
		trim: true, // Eliminamos los espacion vacios del princion o final de nuestro email
		lowercase: true // Nuestro email siempre sera en minusculas
	},
	password: {
		type: String, // Tipo String
		required: true //Es requerido
	},
	isAdmin: {
		type: Boolean, //----
		 //---
		default: false // Al momento de crear este campo si no se lo pasa el valor que tomara por defecto sera 'false'
	},
	isActive: { // Propio del Repo, si esta activo esta cuenta
		type: Boolean,
		
		default: true
	},
	// uuid: { //Elimino uuid pienso que lo podemos obtener desde el mismo _id
	// 	type: String,
	// 	//
	// 	//unique: true,
	// 	//default: randomUUID
	// },
	registrationDate: { // Fecha de registro 
		type: Date, //Tipo Date
		
		default: Date.now // Por defecto si no se manda la fecha tomara en cuenta la fecha actual del servidor donde corre MONGODB
	},
	lastLogin: { // Ultima hora o fecha de logueo
		type: Date, //----
		 //----
		default: Date.now //-----
	},
	ability:{
		type:Array,
		
		default:[{resource: 'admin'}]
	},
	role:{
		type:String,
		
		default:'admin'
	},
	turno:{
		type:String,
		
	},
	apellido:{
		type:String,
		
	},
	telefono:{
		type:String,
		
	},
	direccion:{
		type:String,
		
	},
	nivel:{
		type:String,
		
	},
	paralelo:{
		type:String,
		
	}
});

/**
 * Hash the password of user before save on database
 */
UsersSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.genSalt((err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});

export { UsersSchema }; // exportamos userSchema lo que hace es escriptar nuestra contrasenia
