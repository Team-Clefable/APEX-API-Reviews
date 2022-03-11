const express = require('express');
// const routes = require('./routes');
require('dotenv').config();

const { getMetaData } = require('./routes/metaData');
const {
  getReviews, postReview, reportReview, markHelpful,
} = require('./routes/reviews');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
// app.use('/api/reviews', routes);

app.get('/api/reviews', getReviews);
app.post('/api/reviews', postReview);

app.get('/api/reviews/meta', getMetaData);

app.put('/api/reviews/:review_id/report', reportReview);

app.put('api/reviews/:review_id/helpful', markHelpful);

app.get(`/${process.env.LOADER_IO_KEY}`, (req, res) => {
  res.send(process.env.LOADER_IO_KEY);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
