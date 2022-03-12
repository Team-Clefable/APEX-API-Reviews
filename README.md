# APEX backend reviews microservice

## Description
This is a backend microservice designed for the ratings and reviews of an ecommerce store. The database queries have been written with read operations and a horizontal scaling approach in mind.


## Getting Started
### Technologies
- PostgreSQL through either homebrew or from the postgreSQL website
  https://www.postgresql.org/download/
- Node 14+
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
| sort | TEXT | "newest", "helpful", "relevant" |
### POST /api/reviews
### GET /api/reviews/meta
Query Parameters
| Parameter | Typee | Description |
| --------- | ----- | ----------- |
| product_id| INT   | Specifies product for which review to retrieve|
### PUT /api/reviews/:review_id/helpful
### PUT /api/reviews/:review_id/report
