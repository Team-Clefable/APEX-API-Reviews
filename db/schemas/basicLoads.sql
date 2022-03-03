-- loads in review photos, reviews,  half of characteristics, and characteristics_reviews csv files
-- loads tables review_photos, reviews, characteristics, and characteristics_reviews

-- meta load
COPY meta(product_id) FROM '../../data/reviews.csv' WITH (FORMAT csv);
-- COPY