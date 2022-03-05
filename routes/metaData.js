const db = require('../db');

module.exports = {
  getMetaData: async (req, res) => {
    try {
      const result = db.query(
        `
        SELECT m.product_id, () as ratings, () as recommended, () as characteristics
        FROM meta m LEFT JOIN product_characteristics_join
        `,
        [],
      );
      res.status(200).send(result.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
