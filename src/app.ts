import express = require('express');
import { Express } from 'express';
import dotenv = require('dotenv');
import api from './api';
import helmet  from 'helmet';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json())
app.use(helmet())

app.use("/api", api)

app.listen(port, () => {
    console.log(`App ran at ${port}`)
})