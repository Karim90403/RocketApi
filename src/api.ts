import express = require('express');
import { Request, Response } from 'express';
const app = express.Router();
import dotenv = require('dotenv');

dotenv.config();

app.get("/getData", async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: req.query });
    } catch (err) {
        res.status(400).json({ message: "Error", err });
    }

})

export default app