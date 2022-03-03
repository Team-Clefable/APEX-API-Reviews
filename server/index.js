const express = require('express');
const router = require('./routes');

const app = express();
const PORT = 3000; // process.env.PORT

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
