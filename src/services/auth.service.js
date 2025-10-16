import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repositorie.js"
import ServerError from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"

class AuthService {
    static async register(username, password, email) {
        //Verificar que el usuario no este repetido
        const user_found = await UserRepository.getByEmail(email)
        if (user_found) {
            throw new ServerError(400, 'Email ya en uso')
        }

        //Encriptar la contraseña
        const password_hashed = await bcrypt.hash(password, 12)

        //guardarlo en la DB
        const user_created = await UserRepository.createUser(username, email, password_hashed)
        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created._id.toString()
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
            <a href='${ENVIRONMENT.URL_API}/api/auth/verify-email/${verification_token}'>Verificar email</a>
            `
        })
    }

    static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)
            await UserRepository.updateById(
                payload.user_id, 
                {
                    verified_email: true
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

    static async login(email, password){
        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }
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
}

export default AuthService