import mongoose from "mongoose"

/*
TABLA V: Mensajes_Canal, qué mensajes hay en cierto canal, info del msj.
1. PK id: INT
2. fk_id_miembro_workspace_emisor: INT
3. fk_canal_id: INT
4. texto: TEXT(1500)
5. fecha_creacion: DATE
6. status: BOOLEAN
*/

const messageChannelSchema = new mongoose.Schema(
    {
        fk_id_miembro_workspace_emisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MemberWorkspace',
            required: true
        },
        fk_canal_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChannelWorkspace',
            required: true
        },
        texto: {
            type: String,
            maxlength: 1500,
            required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)
//Crear el modelo de MessageChannel, cada accion que hagamos a la coleccion de MessageChannel se hara por medio del modelo
const MessagesChannel = mongoose.model('MessageChannel', messageChannelSchema)
export default MessagesChannel