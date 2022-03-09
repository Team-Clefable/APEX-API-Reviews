const db = require('../db');

module.exports = {
  getMetaData: async (req, res) => {
    const { product_id } = req.query;
    try {
      const queryResult = await db.query(
        `
        EXPLAIN ANALYZE
        SELECT *
          FROM meta m
          JOIN product_characteristics_join j
          ON m.product_id = j.product_id
          JOIN characteristics c
          ON j.characteristic_id = c.id
          WHERE m.product_id = $1;
        `,
        [product_id],
      );

      const { rows } = queryResult;
      // if (!rows.length) {
      //   res.status(404).send('Oops! Looks like that product does not exist.');
      //   return;
      //   // throw new Error('Oops! Looks like that product does not exist.');
      // }

      const characteristics = {};
      // Optimize later
      // ASK STAFF: This loop ok?
      // TRUMAN: loop is not ideal do in backend and DB
      rows.forEach((queryObj) => {
        characteristics[queryObj.name] = {
          id: queryObj.id,
          value: queryObj.total_score / queryObj.total_votes,
        };
      });

      const formattedQueryResult = {
        product_id: rows[0].product_id,
        ratings: {
          1: rows[0].rating_1,
          2: rows[0].rating_2,
          3: rows[0].rating_3,
          4: rows[0].rating_4,
          5: rows[0].rating_5,
        },
        recommended: {
          false: rows[0].not_recommended,
          true: rows[0].recommended,
        },
        characteristics,
      };

      res.status(200).send(formattedQueryResult);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
