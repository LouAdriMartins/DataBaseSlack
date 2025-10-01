import UserRepository from "../repositories/user.repositorie.js"
import ServerError from "../utils/customError.utils.js"
import bcrypt from 'bcrypt'
import transporter from "../config/mailer.config.js"
import ENVIRONMENT from "../config/environment.config.js"
import jwt from 'jsonwebtoken'

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
            throw new ServerError('Este correo ya se encuentra registrado', 400)
        }
        // Encriptar la contraseña
        const password_hashed = await bcrypt.hash(password, 12)

        // Creo el usuario en la base de datos con la contraseña encriptada
        const user_created = await UserRepository.createUser(username, email, password_hashed)

        // creamos token de verificacion
        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )

        await transporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: ENVIRONMENT.GMAIL_USER,
            subject: 'Verificacion de correo electronico',
            html: `
            <h1>Hola desde node.js</h1>
            <p>Este es un mail de verificacion</p>
            <a href='http://localhost:8080/api/auth/verify-email/${verification_token}'>Verificar email</a>
            `
        })
    }

    static async login(email, password){
        /* 
        - Buscar por email y guardar en una variable
            - No se encontro: Tiramos error 404 'Email no registrado' / 'El email o la contraseña son invalidos'
        - Usamos bcrypt.compare para checkear que la password recibida sea igual al hash guardado en DB
            - En caso de que no sean iguales: 401 (Unauthorized) 'Contraseña invalida' / 'El email o la contraseña son invalidos'
        - Generar el authorization_token con los datos que coinsideremos importantes para una sesion: (name, email, rol, created_at) (NO PASAR DATOS SENSIBLES)
        - Retornar el token
        */
        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }
        /* Permite saber si cierto valor es igual a otro cierto valor encriptado */
        const is_same_password = await bcrypt.compare(password, user.password)
        if(!is_same_password){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )
        return {
            authorization_token
        }
    }

    static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)
            await UserRepository.updateById(
                payload.user_id, 
                {
                    email_verified: true
                }
            )
            return
        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    } 
}

export default AuthService