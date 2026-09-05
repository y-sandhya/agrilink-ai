CREATE DATABASE IF NOT EXISTS agrilink
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrilink;

CREATE TABLE IF NOT EXISTS market_prices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  state VARCHAR(120) NULL,
  district VARCHAR(120) NULL,
  market VARCHAR(180) NOT NULL,
  commodity VARCHAR(120) NOT NULL,
  variety VARCHAR(180) NULL,
  grade VARCHAR(120) NULL,
  arrival_date VARCHAR(40) NULL,
  min_price DECIMAL(12,2) NULL,
  max_price DECIMAL(12,2) NULL,
  modal_price DECIMAL(12,2) NULL,
  source VARCHAR(180) NOT NULL,
  fetched_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_market_record (
    state, district, market, commodity, variety, grade, arrival_date
  ),
  INDEX idx_commodity (commodity),
  INDEX idx_state_district (state, district),
  INDEX idx_arrival_date (arrival_date)
);
