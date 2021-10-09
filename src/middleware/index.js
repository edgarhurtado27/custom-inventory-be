const express = require('express');
const ExpressPinoLogger = require('express-pino-logger');
const logger = require('../../lib/logger');

const reqLogger = ExpressPinoLogger({ logger });
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
const stack = [];
let stopped = false;

signals.forEach((signal) => {
  process.on(signal, () => {
    if (stopped) return;
    stopped = true;
  });
});

const router = express.Router();
router.get('/', (req, res) => {
  res.status(stopped ? 500 : 200).send('App online');
});

stack.push(router);
stack.push(reqLogger);
stack.push(express.json());

module.exports = stack;
