SELECT *
FROM users;
-- WHERE owner_id IS NOT null;
-- --
-- UPDATE users SET planets = null;
-- DELETE FROM planets WHERE owner_id IS null;
-- ALTER TABLE solar_systems
-- RENAME COLUMN sun_name TO name;
-- ADD COLUMN planets integer [];
-- --
--CREATE TABLE solar_systems (
--  id SERIAL PRIMARY KEY,
--  sun_name VARCHAR(25),
--  planet_list INT []
--);
-- --
-- DROP TABLE solar_system;
-- --
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public';
-- ALTER TABLE planets
-- ALTER COLUMN id TYPE VARCHAR(255);
-- SELECT *
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'planets';