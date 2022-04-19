import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { createAuthToken } from '../auth/jwt.js';
import { authValidations } from '../auth/authValidations.js';
import { isValidEmail, isStrongPassword } from '../../helpers/validations.js';
import { securityVariablesConfig, globalVariablesConfig } from '../../config/appConfig.js';

/**
 * All resolvers related to auth
 * @typedef {Object}
 */
export default {
	Query: {
	},
	Mutation: {
		/**
		 * It allows to users to register as long as the limit of allowed users has not been reached
		 */
		registerUser: async (parent, {name, email, password }, context) => { // Registramos un nuevo usuario
			if (!email || !password) {
				throw new UserInputError('Data provided is not valid'); // La forma en como controla los errores apollo-express 
			}

			if (!isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const numberOfCurrentlyUsersRegistered = await context.di.model.Users.find().estimatedDocumentCount(); // Obtenemos la cantidad de usuarios regsitrados en nuestra collection

			authValidations.ensureLimitOfUsersIsNotReached(numberOfCurrentlyUsersRegistered, globalVariablesConfig.limitOfUsersRegistered);

			const isAnEmailAlreadyRegistered = await context.di.model.Users.findOne({ email });// Busca si el email ya existe

			if (isAnEmailAlreadyRegistered) {
				throw new UserInputError('Data provided is not valid'); // El email ya existe 
			}

			await new context.di.model.Users({ name, email, password }).save(); // Si paso todas las verificaciones y no obtuvimos erros lo guardamos en nuestra base de datos

			const user = await context.di.model.Users.findOne({ email }); // Volvemos a busar el email y su datos aunque esta linea lo veo innecesario porque la linea de arriba nos devuelve tambien el documento

			return {
				token: createAuthToken({name:user.name, email: user.email, isAdmin: user.isAdmin, isActive: user.isActive ,uuid:user._id}, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration) // creamos el token
			};
		},
		/**
		 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When an user authenticates the value of lastLogin will be updated
		 */
		authUser: async (parent, { email, password }, context) => {
			if (!email || !password) {
				throw new UserInputError('Invalid credentials');
			}

			const user = await context.di.model.Users.findOne({ email, isActive: true });
			//console.log(user);
			if (!user) {
				throw new UserInputError('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password); // Determina si la contrasenia es correcta

			if (!isCorrectPassword) {
				throw new UserInputError('Invalid credentials');
			}

			await context.di.model.Users.findOneAndUpdate({ email }, { lastLogin: new Date().toISOString() }, { new: true }); // Actualizamos el ultimo tiempo de conexion

			return {
				token: createAuthToken({  email: user.email, isAdmin: user.isAdmin,uuid:user._id,name:user.name }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration) // Retornamos el token para el usuario logueado
			};
		},
		/**
		 * It allows to user to delete their account permanently (this action does not delete the records associated with the user, it only deletes their user account)
		 */
		deleteMyUserAccount:  async (parent, args, context) => { // Elimanos nuestra cuenta de usuario
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return context.di.model.Users.deleteOne({ uuid: user.uuid });
		}
	}
};
