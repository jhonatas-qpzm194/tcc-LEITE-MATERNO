import { Router } from 'express'

const endpoints = Router();

endpoints.get('/welcome', (req, res) => {
  res.send({ mensagem: 'Bem-vindo à API do Laços Maternos!' });
});

export default endpoints;