const express = require('express');
const app = express();

const port = process.env.POR||3000;

app.listen(port);