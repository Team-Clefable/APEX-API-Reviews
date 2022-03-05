// const express = require('express');
const router = require('express').Router();
const { getReview, markHelpful } = require('./reviews');
// const { getMetaData } = require('./metaData');

router.get('/', getReview);

// router.post('/', );

// router.get('/meta', models);

// router.put('/:review_id/report', models);

router.put('/:review_id/helpful', markHelpful);

module.exports = router;
