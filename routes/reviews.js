// This file is gonna be fat
const db = require('../db');

module.exports = {
  getReview: async (req, res) => {
    const { product_id } = req.query;
    const sort = req.query.sort || 'relevant'; // can use switch case here default to relevant
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    try {
      const result = await db.query(
        // 620 ms
        // `SELECT r.review_id, rating,
        // summary, recommend, response, body, date,
        // reviewer_name, helpfulness, ARRAY_AGG((p.id, p.photo_url)) as photos
        // FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
        // WHERE product_id = ${product_id}
        // GROUP BY r.review_id;`,

        // 639 ms
        `SELECT r.review_id, rating,
        summary, recommend, response, body, date,
        reviewer_name, helpfulness, json_agg(json_build_object(
          'id',p.id, 'url', p.photo_url
          )) as photos
        FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
        WHERE product_id = ${product_id}
        GROUP BY r.review_id;`,
        [],
      );
      res.status(200).send(result.rows);
      // if query is empty it will return the empty object with a 200 code
    } catch (err) {
      // no product id sends a 422
      res.status(500).send(err);
    }
  },

  // this one is gonna be fat
  postReview: async (req, res) => {
    // req.body object stuff
    // product id
    // rating int 1-5
    // summary
    // body
    // recommend bool
    // name
    // email
    // photos array
    //    text link items
    // characteristics object
    //    characteristic id key and int 1-5 value
  },

  reportReview: async (req, res) => {
    const { review_id } = req.params;
    try {
      await db.query(
        `UPDATE reviews
        SET reported = true
        WHERE review_id = ${review_id}`,
      );
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(404);
    }
  },

  markHelpful: async (req, res) => {
    const { review_id } = req.params;
    try {
      await db.query(
        `
        UPDATE reviews
        SET helpfulness = helpfulness + 1
        WHERE review_id = ${review_id}
        `,
        [],
      );
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(404);
    }
  },
};

// when pulling data out of database, data structures and algorithm knowledge helps
