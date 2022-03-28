# APEX backend reviews microservice

## Description
This is a backend microservice designed for the ratings and reviews of an ecommerce store. The database queries have been written with read operations and a horizontal scaling approach in mind.


## Getting Started
### Technologies
- PostgreSQL through either homebrew or from the postgreSQL website
  https://www.postgresql.org/download/
- Node 14+
- Express
### Installation
- Clone the project
- Use npm to install project dependencies
```bash
npm install
```

### Environment Setup
create a .env file in the root of the directory:
``` bash
PGHOST=FILL_ME_IN
PGUSER=FILL_ME_IN
PGPASSWORD=FILL_ME_IN
PGDATABASE=FILL_ME_IN
SERVER_PORT=FILL_ME_IN
```

If you are not using a load balancer but would like to test using loader.io
- add this line to the .env:
```bash
LOADER_IO_KEY=FILL_ME_IN
```
- Uncomment this line in index.js of root directory:
```bash
// app.get(`/${process.env.LOADER_IO_KEY}`, (req, res) => {
//   res.send(process.env.LOADER_IO_KEY);
// });
```

### CSV data
Create a directory named "data" in the root directory. This is where we will store CSV files that contain all our review data

## Running the project
### ELT
Run the scripts
```bash
npm run build-db
npm run load-db
npm run transform-db
```
to fill postgres with your data points

### Run server
```bash
npm run server
```
Or
```bash
npm run server-dev
```

## REST API
### GET /api/reviews
Query Parameters

| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| product_id| INT   | Specifies product for which review to retrieve|
| page | INT | Selects the page of results to return. Default 1. |
| count | INT | Specifies how many results per page. Default 5 |
| sort | TEXT | "newest", "helpful", "relevant". Default "relevant" |

Status Code 200:
```bash
{
  "product": [product_id],
  "page": [page_number],
  "count": [count_number],
  "results": [
    {
      "review_id": [review_id],
      "rating": [rating_number],
      "summary": "summary of review",
      "recommend": [bool],
      "response": [text or null],
      "body": "body text of review",
      "date": "2022-02-25T00:00:00.000Z",
      "reviewer_name": "reviewer",
      "helpfulness": [helpfulness count],
      "photos": [
        {
          "id": [photo_id],
          "url": "photo_url",
        },
      ]
    },
  ]
}
```
### POST /api/reviews
Body Parameters

| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| product_id| INT   | Specifies product for which review to retrieve |
| rating | INT   | number 1-5 indicating the review rating |
| summary | TEXT   | summary of text review |
| body | TEXT   | Continued or full text of the review |
| recommend | BOOL | indicating if the reviewer recommends the product |
| name | TEXT | Username for question asker |
| email | TEXT | email for question asker |
| photos | ARRAY | Array of text that link to images to be shown |
| characteristics | OBJECT | keys representing the characteristic_id and the value rating for that specific characteristic |

Status code 201
### GET /api/reviews/meta
Query Parameters

| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| product_id| INT   | Specifies product for which review to retrieve |

Status Code 200:
```bash
{
  "product_id": [product_id],
  "ratings": {
    "1": [rating_count],
    "2": [rating_count],
    "3": [rating_count],
    "4": [rating_count],
    "5": [rating_count]
  },
  "recommended": {
    "false": [false_count],
    "true": [true_count]
  },
  "characteristics": {
    "characteristic_name": {
      "id": [characteristic_id],
      "value": [average_characteristics_value]
    },
}
}
```
### PUT /api/reviews/:review_id/helpful
Parameters

| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| review_id| INT   | Specifies review mark as helpful |

Status Code 204
### PUT /api/reviews/:review_id/report
Parameters

| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| review_id| INT   | Specifies review mark as reported |

Status Code 204
