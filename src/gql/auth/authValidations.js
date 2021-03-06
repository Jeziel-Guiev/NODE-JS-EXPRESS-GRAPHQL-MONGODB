import { AuthenticationError, ForbiddenError, ValidationError } from 'apollo-server-express';
import models from '../../data/models/index.js'; // importamos todos nusetros modelos

/**
 * Auth validations repository
 * @typedef {Object}
 */
export const authValidations = { //Nos va servir para verificar que la cantidad de usuarios registrados no a superado el limite
	/**
	 * Check if the maximum limit of users has been reached. If limit is reached, it throws an error.
	 * @param {number} numberOfCurrentlyUsersRegistered 	- The number of users currently registered in the service
	 * @param {number} limitOfUsers 						- Represents the maximum number of users allowed in the service. Zero represents no limit
	 */
	ensureLimitOfUsersIsNotReached: (numberOfCurrentlyUsersRegistered, limitOfUsers) => {
		if (limitOfUsers === 0) {
			return; // si el limite es cero no hace nada
		}

		if (numberOfCurrentlyUsersRegistered >= limitOfUsers) {
			throw new ValidationError('The maximum number of users allowed has been reached. You must contact the administrator of the service in order to register');
		} // devolvemos un mensaje de error cuando se super la cantidad establecida
	},

	/**
	 * Check if in Apollo Server context contains a logged user. If user is not in context, it throws an error
	 * @param {Object} context 			- The context object of Apollo Server
	 * @param {Object} [context.user]  	- The context object data: user data
	 */
	ensureThatUserIsLogged: (context) => {
		if (!context.user) { // Error para determinar si el usuario esta totalmente logueado
			throw new AuthenticationError('You must be logged in to perform this action');
		}
	},

	/**
	 * Check if in Apollo Server context contains an user and is an administrator. If user is not in context or user is not an administrator it throws an error
	 * @param {Object} context 					- The context object of Apollo Server
	 * @param {Object} [context.user]  			- The context object data: user data
	 * @param {boolean} [context.user.isAdmin] 	- The context object data: user data role information
	 */
	ensureThatUserIsAdministrator: (context) => {
		if (!context.user || !context.user.isAdmin) {
			throw new ForbiddenError('You must be an administrator to perform this action');
		} // Error para determinar si el usario es distinto de isAdmin
	},

	/**
	 * Uses the information in the Apollo Server context to retrieve the user's data from the database. If user does not exist, it throws an error.
	 * @async
	 * @param {Object} context 				- The context object of Apollo Server
	 * @param {Object} [context.user]  		- The context object data: user data
	 * @returns {User}
	 */
	getUser: async (context) => {
		if (!context.user) {
			return null;
		} // Si no se pasa el context devuelve null
	
		const userUUID = context.user.uuid || null; // le enviamos el ID de nuestro usuario
		const user = await models.Users.findOne({ uuid: userUUID }); // Buscamos en nuestra collecion users por ID
		if (!user) {
			throw new AuthenticationError('You must be logged in to perform this action');
		}

		return user;
	},
};