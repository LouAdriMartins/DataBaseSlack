import mongoose from "mongoose"

/*
TABLA IV: Canales_Workspace
1. PK id: INT
2. FK fk_id_workspace: INT (vamos a saber con que espacio de trabajo se relaciona este canal)
3. nombre: VARCHAR(20)
4. fecha_creacion: DATE
5. status: BOOLEAN
*/
const channelWorkspaceSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        nombre: {
            type: String,
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
//Crear el modelo de Channel, cada accion que hagamos a la coleccion de Channel se hara por medio del modelo
const ChannelsWorkspace = mongoose.model('ChannelWorkspace', channelWorkspaceSchema)
export default ChannelsWorkspace