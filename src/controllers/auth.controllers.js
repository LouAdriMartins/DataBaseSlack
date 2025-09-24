import ServerError from "../utils/customError.utils.js"
import AuthService from "../services/auth.service.js"

class AuthController {
    // lógica para registrar un nuevo usuario
        /* 
            Recibiremos un username, email, password
            Validar los 3 campos
            */
    static async register(request, response) {
        try {
            const {
                username, 
                email, 
                password
            } = request.body
            // validamos los campos
            if (!username) {
                throw new ServerError(400, 'Debe ingresar un nombre de usuario valido')
            }
            else if (!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new ServerError(400, 'Debe ingresar un correo electronico valido')
            }
            else if (!password || password.length < 8) {
                throw new ServerError(400, 'Debe ingresar una contraseña valida')
            }
            await AuthService.register(username, password, email)
            response.json({
                ok: true
            })
        }
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }
    // lógica para loguear un usuario
    static async login() {
        
    }
    // lógica para verificar el email de un usuario
    static async verifyEmail() {
        
    }
}
export default AuthController