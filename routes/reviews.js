// This file is gonna be fat
const db = require('../db');

module.exports = {
  getReview: async (req, res) => {
    try {
      const result = await db.query(
        'SELECT * FROM reviews FULL JOIN photos ON reviews.review_id = photos.review_id WHERE product_id = 2;',
        [],
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  postReview: () => {},
};
