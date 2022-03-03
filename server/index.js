const express = require('express');
const models = require('../db/models');

const app = express();
const PORT = 3000; // process.env.PORT

app.use(express.json());

app.get('api/reviews', models);

app.post('api/reviews', models);

app.get('api/reviews/meta', models);

app.put('api/reviews/:review_id/helpful', models);

app.put('api/reviews/:review_id/report', models);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
