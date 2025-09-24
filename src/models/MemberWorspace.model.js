import mongoose from "mongoose"

/*TABLA III: Miembros_Workspace, que sería la lista de miembros por cada canal
1. PK id: INT
2. FK fk_id_workspace: INT
3. FK fk_id_usuario: INT
4. rol: ENUM - 	 Este ipo de ato puede validar si el miembro es un admin, editor o lector.
5. fecha_creacion: DATE
*/

const memberWorkspaceSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        fk_id_usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rol: {
            type: String,
            enum: ['admin', 'support', 'user'],
            default: 'user',
            required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        }
    }
)
//Crear el modelo de MemberWorkspace, cada accion que hagamos a la coleccion de MemberWorkspace se hara por medio del modelo
const MembersWorkspace = mongoose.model('MemberWorkspace', memberWorkspaceSchema)
export default MembersWorkspace