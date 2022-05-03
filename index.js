const express = require('express');
require('dotenv').config();

const { getMetaData } = require('./controllers/metaData');
const {
  getReviews, postReview, reportReview, markHelpful,
} = require('./controllers/reviews');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get('/api/reviews', getReviews);
app.post('/api/reviews', postReview);

app.get('/api/reviews/meta', getMetaData);

app.put('/api/reviews/:review_id/report', reportReview);

app.put('api/reviews/:review_id/helpful', markHelpful);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
