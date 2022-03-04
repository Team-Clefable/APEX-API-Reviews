// exports.productReview = require('./productReview.js');
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

module.exports = {
  async query(text, params) {
    const result = await pool.query(text, params);
    return result;
  },
};
