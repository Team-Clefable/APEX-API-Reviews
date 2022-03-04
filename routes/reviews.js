// This file is gonna be fat
const db = require('../db');

module.exports = {
  getReview: async (req, res) => {
    const { product_id } = req.query;
    const sort = req.query.sort || 'relevant';
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    try {
      const result = await db.query(
        // `SELECT  r.review_id, rating, summary, recommend, response, body, date_added, reviewer_name, helpfulness,
        // ARRAY(SELECT p.id, p.photo_url FROM photos p WHERE p.review_id = r.review_id) as photos
        // FROM reviews r
        // WHERE r.product_id = ${product_id};
        // `,
        // `SELECT  r.review_id, rating, summary, recommend, response, body, date_added, reviewer_name, helpfulness
        // FROM reviews r
        // WHERE r.product_id = ${product_id};
        // `,
        `SELECT r.review_id, rating,
        summary, recommend, response, body, date_added,
        reviewer_name, helpfulness, ARRAY_AGG(photo_url) as photos
        FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
        WHERE product_id = ${product_id}
        GROUP BY r.review_id;`,
        //  ON reviews.review_id = photos.review_id WHERE product_id =  ${product_id};`,
        [],
      );
      res.status(200).send(result.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  postReview: async (req, res) => {},

  reportReview: async (req, res) => {},

  markHelpful: async (req, res) => {},
};
