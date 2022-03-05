// const express = require('express');
const router = require('express').Router();
const { getMetaData } = require('./metaData');
const {
  getReview, postReview, reportReview, markHelpful,
} = require('./reviews');

router.get('/', getReview);

router.post('/', postReview);

router.get('/meta', getMetaData);

router.put('/:review_id/report', reportReview);

router.put('/:review_id/helpful', markHelpful);

module.exports = router;
