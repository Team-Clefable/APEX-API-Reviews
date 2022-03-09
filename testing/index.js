import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
  vus: 20,
  duration: '15s',
};

const randomNumber = (max, min) => (
  Math.floor(Math.random() * (max - 1 + min) + min)
);
let count = randomNumber(1000000, 1);
const metaUrl = `http://localhost:3000/api/reviews/meta?product_id=${count}`;
// const reviewsUrl = `http://localhost:3000/api/reviews?product_id=${count}`;

export default function () {
  const res = http.get(metaUrl);
  sleep(1);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time< 200ms': (r) => r.timings.duration < 200,
    'transaction time< 500ms': (r) => r.timings.duration < 500,
    'transaction time< 1000ms': (r) => r.timings.duration < 1000,
    'transaction time< 2000ms': (r) => r.timings.duration < 2000,
  });
  count = randomNumber(1000000, 1);
}
