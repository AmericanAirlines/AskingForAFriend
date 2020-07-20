import express from 'express';
import bodyParser from 'body-parser';
import health from './health';

const api = express.Router();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.use(health);

export default api;
