import { validateAuthToken } from './jwt.js';
import { environmentVariablesConfig } from '../../config/appConfig.js';
import { ENVIRONMENT } from '../../config/environment.js';
import { logger } from '../../helpers/logger.js';
import models from '../../data/models/index.js';

/**
 * Context function from Apollo Server
 */
export const setContext = async ({ req }) => {
	const context = {
		di: {
			model: {
				...models
			}
		}
	};

	let token = req.headers['authorization']; // Recibimos el token desde el headers http

	if (token && typeof token === 'string') { // verificamos que nuestro token es un String y que no sufrio ningun cambio de su tipo
		try {
			const authenticationScheme = 'Bearer';
			if (token.startsWith(authenticationScheme)) { // Verifica si una cadena empieza con Bearer devuelve true o false 
				token = token.slice(authenticationScheme.length, token.length); //slice extrae un intervalo de la cadena token debemos enviarle (inicio,final)
			}
			const user = await validateAuthToken(token); // Validamos el token 
			context.user = user; // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			if (environmentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}

	return context; /// Retornamos los modelos de nuestra base de datos y el token verificado
};
