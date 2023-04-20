"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const api_1 = __importDefault(require("./api"));
const helmet_1 = __importDefault(require("helmet"));
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use((0, helmet_1.default)());
app.use("/api", api_1.default);
app.listen(port, () => {
    console.log(`App ran at ${port}`);
});
