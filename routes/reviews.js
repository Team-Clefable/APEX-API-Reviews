/* eslint-disable radix */
const format = require('pg-format');

const db = require('../db');

module.exports = {
  getReview: async (req, res) => {
    const { product_id } = req.query;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sortParam = req.query.sort || 'relevant';
    let sortQueryBy;
    switch (sortParam) {
      case 'helpful':
        sortQueryBy = 'helpfulness DESC';
        break;
      case 'newest':
        sortQueryBy = 'date DESC';
        break;
      case 'relevant':
        sortQueryBy = 'helpfulness DESC, date DESC';
        break;
      default:
        sortQueryBy = 'helpfulness';
    }
    const queryResultStartIndex = count * (page - 1);
    const queryResultEndIndex = count * page;

    try {
      const modifiedQueryObject = {
        product: product_id,
        page,
        count,
      };

      const queryResult = await db.query(
        `SELECT r.review_id, rating,
        summary, recommend, response, body, date,
        reviewer_name, helpfulness, json_agg(json_build_object(
          'id',p.id, 'url', p.photo_url
          )) as photos
        FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
        WHERE product_id = $1
        GROUP BY r.review_id
        ORDER BY $2;`,
        [product_id, sortQueryBy],
      );
      if (!queryResult.rows.length) {
        res.status(404).send('Oops! Looks like that product does not exist.');
        return;
      }
      // Optimize later
      // ASK STAFF: should i use slice here? better options?
      // TRUMAN: dont use slice, figure out how to use pg to filter query beforehand
      modifiedQueryObject.results = queryResult.rows
        .slice(queryResultStartIndex, queryResultEndIndex);

      if (!modifiedQueryObject.results.length) {
        res.status(404).send('Oops! Looks like there are no reviews on that page. Try an earlier page.');
        return;
      }

      res.status(200).send(modifiedQueryObject);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // ASK STAFF: Multiple try catch blocks for error handling? Better error handling feedback?
  postReview: async (req, res) => {
    let newReviewId;
    const {
      product_id,
      rating,
      summary,
      body,
      recommend,
      name,
      email,
      photos,
      characteristics,
    } = req.body;

    try {
      const queryResult = await db.query(
        `INSERT INTO reviews
          (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        RETURNING review_id;`,
        [product_id, rating, summary, body, recommend, name, email],
      );

      newReviewId = queryResult.rows[0].review_id;
    } catch (err) {
      res.status(400).send(`Invalid request parameters. Error: ${err.message}`);
    }

    try {
      // TRUMAN: PG can bulk insert
      // TRUMAN: map over photos to add newReviewId and only 1 insert
      const formattedReviewPhotos = photos.map((photoUrl) => [newReviewId, photoUrl]);
      await db.query(
        format(
          'INSERT INTO photos (review_id, photo_url) VALUES %L',
          formattedReviewPhotos,
        ),
        [],
      );
    } catch (err) {
      res.status(400).send(`Invalid photo parameter. Error: ${err.message}`);
    }

    try {
      const formattedCharacteristicsReviews = Object.entries(characteristics).map((char_entry) => {
        const characteristic_id = parseInt(char_entry[0]);
        const char_review_value = char_entry[1];
        return [newReviewId, characteristic_id, char_review_value];
      });
      await db.query(
        format(
          `INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
          VALUES %L`,
          formattedCharacteristicsReviews,
        ),
        [],
      );
    } catch (err) {
      res.status(500).send(`Characteristics table insert problem. Error: ${err.message}`);
    }

    // Optimize later to do bulk insert
    try {
      Object.entries(characteristics).forEach(async (char_entry) => {
        const characteristic_id = parseInt(char_entry[0]);
        const char_review_value = char_entry[1];
        await db.query(
          `UPDATE product_characteristics_join j
          SET
            total_score = total_score + $1,
            total_votes = total_votes + 1
          WHERE j.product_id = $2 AND j.characteristic_id = $3;`,
          [char_review_value, product_id, characteristic_id],
        );
      });
    } catch (err) {
      res.status(500).send(`Characteristics totaling problem. Error: ${err.message}`);
    }

    try {
      await db.query(
        `UPDATE meta m
        SET
          ${recommend ? 'recommended = recommended + 1' : 'not_recommended = not_recommended + 1'},
          rating_${rating} = rating_${rating} + 1
        WHERE m.product_id = $1;`,
        [product_id],
      );

      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(`Meta data problem. Error: ${err.message}`);
    }
  },

  reportReview: async (req, res) => {
    const { review_id } = req.params;
    try {
      await db.query(
        `
        UPDATE reviews
        SET reported = true
        WHERE review_id = ${review_id}
        ;`,
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
        ;`,
      );
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(404);
    }
  },
};
