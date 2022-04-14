import mongoose from 'mongoose';

import { UsersSchema } from './schemas/index.js'; // Importamos nuestro esquema de usuario

export default {
	Users: mongoose.model('users', UsersSchema), //Exportamos el modelo Users con la cual tambien se crea la collecion users
};