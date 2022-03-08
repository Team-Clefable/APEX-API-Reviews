// This file is gonna be fat
const db = require('../db');

module.exports = {
  getReview: async (req, res) => {
    const { product_id } = req.query;
    const sortParam = req.query.sort;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    let sortQueryBy;
    switch (sortParam) {
      case 'helpful':
        sortQueryBy = 'helpfulness';
        break;
      case 'newest':
        sortQueryBy = 'date';
        break;
      case 'relevant':
        sortQueryBy = 'helpfulness, date';
        break;
      default:
        sortQueryBy = 'helpfulness';
    }

    try {
      // postgres aggregation
      // const queryResult = await db.query(
      //   // 5.41 s
      //   // 4.63 s
      //   // 3.79 s
      //   `SELECT r.review_id, rating,
      //   summary, recommend, response, body, date,
      //   reviewer_name, helpfulness, json_agg(json_build_object(
      //     'id',p.id, 'url', p.photo_url
      //     )) as photos
      //   FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
      //   WHERE product_id = ${product_id}
      //   GROUP BY r.review_id
      //   ORDER BY ${sortQueryBy};`,
      // );
      // if (!queryResult.rows.length) {
      //   res.status(404).send('Oops! Looks like that product does not exist.');
      //   return;
      // }
      // res.status(200).send(queryResult.rows);

      // javascript aggregation
      const queryResult = await db.query(
        // 7.65 s
        // 4.92 s
        `
        SELECT r.review_id, r.rating, r.summary, r.recommend, r.response,
        r.body, r.date, r.reviewer_name, r.helpfulness
        FROM reviews r
        WHERE r.product_id = ${product_id}
        `,
      );

      if (!queryResult.rows.length) {
        res.status(404).send('Oops! Looks like that product does not exist.');
        return;
      }

      const queryResultPhotos = await db.query(
        `
        SELECT p.id, p.photo_url AS url
        FROM photos p
        JOIN reviews r
        ON p.review_id = r.review_id
        WHERE r.product_id = ${product_id}
        `,
      );

      const modifiedQueryObject = {
        product: product_id,
        page,
        count,
        results: queryResult.rows.map((queryRow) => (
          {
            review_id: queryRow.review_id,
            rating: queryRow.rating,
            summary: queryRow.summary,
            recommend: queryRow.recommend,
            response: queryRow.response,
            body: queryRow.body,
            date: queryRow.date,
            reviewer_name: queryRow.reviewer_name,
            helpfulness: queryRow.helpfulness,
            photos: queryResultPhotos.rows,
          }
        )),
      };

      res.status(200).send(modifiedQueryObject);
    } catch (err) {
      // no product id sends a 422
      res.status(500).send(err);
    }
  },

  // this one is gonna be fat
  postReview: async (req, res) => {
    const {
      product_id, // int
      rating, // int
      summary, // text
      body, // text
      recommend, // bool
      name, // text
      email, // text
      photos, // array of text
      characteristics // object {id: review_value}
    } = req.body;

    try {
      await db.query(
        `
        INSERT INTO reviews
        VALUES
        `,
      );
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(400);
    }
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
