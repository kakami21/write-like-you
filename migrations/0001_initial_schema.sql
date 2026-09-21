-- Migration number: 0001  2026-09-21T00:00:00.000Z
CREATE TABLE restaurants (
  url TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY NOT NULL,
  restaurant_url TEXT NOT NULL
    REFERENCES restaurants (url),
  detail_url TEXT NOT NULL UNIQUE,
  title TEXT,
  body TEXT,
  review_date TEXT NOT NULL
    CHECK (review_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]'),
  rating REAL NOT NULL
    CHECK (rating BETWEEN 0 AND 5),
  like_count INTEGER NOT NULL
    CHECK (like_count >= 0),
  scraped_at TEXT NOT NULL
);

CREATE INDEX idx_reviews_restaurant_url
  ON reviews (restaurant_url);

CREATE INDEX idx_reviews_review_date
  ON reviews (review_date DESC);
