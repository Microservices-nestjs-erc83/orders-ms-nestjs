import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
    PORT: number
}

const envsSchema = joi.object({
    PORT: joi.number().required(),

})
.unknown(true)          // mas variables de entorno permitidas de la app


const { error, value } = envsSchema.validate( process.env )

if( error ) {
    throw new Error(`Config validation error: ${ error.message }`)
}

const envVars: EnvVars = value              // agregamos el tipado    envVars.PORT

export const envs = {
    port: envVars.PORT,
}







