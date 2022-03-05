DROP DATABASE IF EXISTS reviews;
CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product_characteristics_join CASCADE;
DROP TABLE IF EXISTS characteristics_reviews CASCADE;

DROP TABLE IF EXISTS meta CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;

CREATE TABLE reviews (
  review_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INT NOT NULL, -- will be a secondary index
  rating SMALLINT CHECK (rating > 0) CHECK (rating < 6),
  date_unix BIGINT, -- in UNIX will have to reshape
  summary VARCHAR(1000),
  body VARCHAR(800),
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(30),
  reviewer_email VARCHAR(40),
  response VARCHAR(800),
  -- date_added DATE GENERATED BY DEFAULT CURRENT_TIMESTAMP(3), -- may need to index by this -- transform this to datatime after load
  helpfulness INT DEFAULT 0 -- add index to this
);

CREATE TABLE photos (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  review_id INT references reviews(review_id), -- may need to index by this
  photo_url VARCHAR(1000)
);

CREATE TABLE product_characteristics_join (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INT,
  characteristic_name VARCHAR(15)
);

CREATE TABLE characteristics_reviews (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  old_characteristic_id INT,
  review_id INT references reviews(review_id),
  characteristic_value SMALLINT CHECK (characteristic_value > 0) CHECK (characteristic_value < 6)
);
