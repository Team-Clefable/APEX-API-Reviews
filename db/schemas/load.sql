-- loads in review photos, reviews,  half of characteristics, and characteristics_reviews csv files
-- loads tables review_photos, reviews, characteristics, and characteristics_reviews

\COPY reviews FROM 'data/reviews.csv' WITH DELIMITER ',' CSV HEADER;
\COPY reviews_photos FROM 'data/reviews_photos.csv' WITH DELIMITER ',' CSV HEADER;
\COPY temp_characteristics FROM 'data/characteristics.csv' WITH DELIMITER ',' CSV HEADER;
\COPY temp_characteristics_reviews FROM 'data/characteristics_reviews.csv' WITH DELIMITER ',' CSV HEADER;
