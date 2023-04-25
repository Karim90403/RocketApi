import express = require('express');
import { Request, Response } from 'express';
import dotenv = require('dotenv');
import axios from 'axios'


dotenv.config();
const app = express.Router();

interface Deal {
    name?: string,
    status?: string,
    ResponsiblePerson?: string,
    date?: string,
    Budget?: number,
}

async function amoAuth() {
    try {
        await axios.get("https://rockettesttask.amocrm.ru/")
    } catch (e: any) {
        const token = e.response.data.match(/name="csrf_token" value="(.*?)"/i)[1]
        const authResponse = await axios.post("https://rockettesttask.amocrm.ru/oauth2/authorize", {
            temporary_auth: "N",
            csrf_token: token,
            password: "xyzdit-tamguj-8qiTtu",
            username: "karim90403@gmail.com"
        })
        return authResponse.data?.access_token
    }
    return false
}

app.get("/getData", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        let url = "https://rockettesttask.amocrm.ru/api/v4/leads";
        const access_token = await amoAuth()
        if(req.query.filterName?.length){ url = `https://rockettesttask.amocrm.ru/api/v4/leads?filter[name]=${req.query.filterName}`}
        const leadResponse = await axios.get(url, { headers: { Authorization: "Bearer " + access_token } })
        const deals: Array<Deal> = [];

        for( let i = 0; i < leadResponse.data._embedded.leads.length; i++) {
            const deal: Deal = {}

            deal.name = leadResponse.data._embedded.leads[i].name
            deal.date = new Date(leadResponse.data._embedded.leads[i].created_at * 1000).toLocaleDateString()
            deal.Budget = leadResponse.data._embedded.leads[i].price
            
            const responsiblePresonResponse = await axios.get(`https://rockettesttask.amocrm.ru/api/v4/users/${leadResponse.data._embedded.leads[i].responsible_user_id}` , { 'headers': { Authorization: "Bearer " + access_token } })
            deal.ResponsiblePerson = responsiblePresonResponse.data.name

            const dealStatusResponse = await axios.get(`https://rockettesttask.amocrm.ru/api/v4/leads/pipelines/${leadResponse.data._embedded.leads[i].pipeline_id}/statuses/${leadResponse.data._embedded.leads[i].status_id}`, { 'headers': { Authorization: "Bearer " + access_token } })
            deal.status = dealStatusResponse.data.name

            deals.push(deal)
        }

        res.status(200).json(deals)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default app