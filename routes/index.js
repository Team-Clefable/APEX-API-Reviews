// const express = require('express');
const router = require('express').Router();
const { getReview } = require('./reviews');
// const { getMetaData } = require('./metaData');

router.get('/', getReview);

// router.post('/', );

// router.get('/meta', models);

// router.put('/:review_id/helpful', models);

// router.put('/:review_id/report', models);

module.exports = router;
