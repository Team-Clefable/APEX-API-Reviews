const db = require('../db');

module.exports = {
  getMetaData: async (req, res) => {
    const { product_id } = req.params;
    try {
      const result = db.query(
        `
        SELECT m.product_id, m.ratings, m.recommended, c.characteristics
        FROM meta m
        LEFT JOIN product_characteristics_join c
        WHERE m.product_id = ${product_id} and c.product_id = ${product_id}
        `,
        [],
      );
      res.status(200).send(result.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
