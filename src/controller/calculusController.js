import { Router } from 'express'

const endpoints = Router();

endpoints.post('/calculus', (req, res) => {
  const { qtdDias, mlPorDia } = req.body;
  const total = (qtdDias || 0) * (mlPorDia || 0);
  res.send({ totalMl: total });
});

export default endpoints;