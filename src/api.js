import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { addRoutes } from './router.js'

const api = express();
api.use(cors());
api.use(express.json());
addRoutes(api);

const port = process.env.PORT || 50100;
api.listen(port, () => console.log(`-> API subiu com sucesso na porta ${port}`));