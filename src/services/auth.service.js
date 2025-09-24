import UserRepository from "../repositories/user.repositorie.js"
import ServerError from "../utils/customError.utils.js"

class AuthService{
    static async register(username, password, email){
        console.log(username, password, email)
        /*
        Verificar que el usuario no exista (no este repetido)
            - .getByEmail en userrepository
        Encriptar la contraseña
        Guardar el usuario en la base de datos
        Enviar un email de verificación
        */
        const user_found = await UserRepository.getByEmail(email)
        if(user_found){
            throw new ServerError({
                status: 400,
                message: 'Este correo ya se encuentra registrado'
            })
        }
    }
}

export default AuthService