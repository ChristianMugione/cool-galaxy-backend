-- SELECT * FROM users
-- ALTER TABLE users ADD COLUMN email VARCHAR(255);
CREATE TABLE solar_systems (
  id SERIAL PRIMARY KEY,
  sun_name VARCHAR(25),
  planet_list INT []
);
-- DROP TABLE solar_system;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';