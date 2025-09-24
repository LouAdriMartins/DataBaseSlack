import mongoose from "mongoose"

/*El esquema tiene los "contratos" de que es un Workspace que luego podremos asignarselo a la coleccion de workspaces:
1. nombre: VARCHAR(20)
2. descripcion: TEXT(1000)
3. img_workspace: VARCHAR(255)
4. fecha_creacion: DATE
5. fecha_modificacion: DATE
6. status: BOOLEAN (activo: true, inactivo: false)
*/
const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            //required: true
        },
        img_workspace: {
            type: String,
            //required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        },
        fecha_modificacion: {
            type: Date,
            default: null
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)
//Crear el modelo de Workspace, cada accion que hagamos a la coleccion de Workspace se hara por medio del modelo
const Workspaces = mongoose.model('Workspace', workspaceSchema)
export default Workspaces