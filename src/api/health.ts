import express from 'express';

const health = express.Router();
health.get('/health', (_, res) => {
  res.send({
    status: 'OK',
    details: 'Everything looks good 👌',
    time: new Date().toISOString(),
  });
});

export default health;
