// exports.productReview = require('./productReview.js');

const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
  async query(text, params) {
    const result = await pool.query(text, params);
    return result;
  },
};
