import express from 'express' // XXX: I am use express to run my api server, you can choose another.
import cors from 'cors' // XXX: CORS

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
const errMsgOfAllowedOrigins = 'The CORS policy for this site ' +
    'does not allow access from the specified Origin.'


export const app = express()

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error(errMsgOfAllowedOrigins), false)
        }
        return callback(null, true)
    },
    credentials: true,
}))
