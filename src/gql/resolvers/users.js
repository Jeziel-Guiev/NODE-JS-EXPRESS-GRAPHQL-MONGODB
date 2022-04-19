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
			//console.log(context.user)
			authValidations.ensureThatUserIsLogged(context); // Filtros para no avanzar si un usario no seta loguado

			authValidations.ensureThatUserIsAdministrator(context); //Si un usuario no es admin
 
			return context.di.model.Users.find({}); // Buscamos todos los registros de nuestra base de datos 
		},
		GetUserforId:async (_, { id },context)=>{
			//console.log('context')
			 authValidations.ensureThatUserIsLogged(context); // Filtros para no avanzar si un usario no seta loguado

			 authValidations.ensureThatUserIsAdministrator(context); //Si un usuario no es admin
 
			
			const data= await context.di.model.Users.findById(id).clone().catch(function(err){ console.log(err)});
			//console.log(data);
			return data;
		}
	},
	Mutation: {
	}
};
