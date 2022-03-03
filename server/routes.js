const express = require('express');
const models = require('../db/models');

const router = express.Router();

// will need to account for authorization

router.route('/reviews')
  .get(models)
  .post(models);

router.get('/reviews/meta', models);

router.put('/reviews/:review_id/helpful', models);

router.put('/reviews/:review_id/report', models);

module.exports = router;
