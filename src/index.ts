
import express from 'express';
import router from './routes';
import dotenv from 'dotenv';
import redisClient from './redisClient';
import session from 'express-session';
import RedisStore from 'connect-redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(
  session({
    store: redisStore,
    resave: false, 
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || '',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60_000 * 3
    },
  }),
)

app.use(router);

app.listen(PORT, () =>
  console.log(`http://localhost:3000`),
);
