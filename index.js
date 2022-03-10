const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use('/api/reviews', routes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
