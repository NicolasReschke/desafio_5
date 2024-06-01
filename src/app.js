import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars'
import mongoose from './config/database.js';
import MongoStore from 'connect-mongo';
import path from 'path'
import { fileURLToPath } from 'url'

import sessionsRouter from './routes/api/sessions.js';
import viewsRouter from './routes/views.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://ReschkeNicolas:Coder456@cluster0.i8k1dis.mongodb.net/desafio_5?retryWrites=true&w=majority&appName=Cluster0' }),
    cookie: { maxAge: 10 * 60 * 1000 },
}));

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/login`);
});