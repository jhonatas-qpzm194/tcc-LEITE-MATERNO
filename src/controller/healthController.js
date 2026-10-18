import { Router } from 'express'

const endpoints = Router();

endpoints.get('/health', (req, res) => {
  res.send({ status: 'API saudável e funcionando!' });
});

export default endpoints;