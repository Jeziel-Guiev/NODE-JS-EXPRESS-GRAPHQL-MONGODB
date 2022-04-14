import { authValidations } from '../auth/authValidations.js';
import models from '../../data/models/index.js'; // importamos todos nusetros modelos

/**
 * All resolvers related to users
 * @typedef {Object}
 */
export default {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context); // Filtros para no avanzar si un usario no seta loguado

			authValidations.ensureThatUserIsAdministrator(context); //Si un usuario no es admin
 
			return context.di.model.Users.find({}); // Buscamos todos los registros de nuestra base de datos 
		},
		getUserforID(_, { id },context){
			console.log(context)
			return models.Users.find({'_id':id}).clone().catch(function(err){ console.log(err)});
		}
	},
	Mutation: {
	}
};
