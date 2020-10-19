-- PostgreSQL


-- Create database (connected from superuser)
-- DROP DATABASE chat; -- удаляем базу данных если она существует

CREATE DATABASE chat; -- создаем базу данных
REVOKE ALL ON DATABASE chat FROM PUBLIC; -- забираем все пара на базу данных у группы public (TEMPORARY, CONNECT)
ALTER DATABASE chat SET search_path TO '$user'; -- ставим пути поиска схем для каждого соединения. Имя схемы будет соответствовать имени роли

-- Create user (connected from superuser)
BEGIN;
  -- DROP ROLE chat; -- удаляем роль если сшществует

  CREATE ROLE chat LOGIN NOINHERIT PASSWORD '12345'; -- создаем роль с возможностью подключения к серверу, и паролем
  -- GRANT CONNECT, CREATE ON DATABASE chat TO chat; -- даем права на подсоединения к базе данных и создания в ней схем
  ALTER DATABASE chat OWNER TO chat; -- * делаем роль chat владельцем базы данных.
COMMIT;

-- Create database structure (connected from chat)
BEGIN;
  -- DROP SCHEMA public; -- * удаляем схему public (not owner of schema public);
  CREATE SCHEMA chat; -- создаем схему с именем роли, т.к. именно в этой схеме будет вестись поиск

  CREATE TABLE users (
    id SERIAL8 NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
  );

  CREATE UNIQUE INDEX users_nickname_u_i ON users (LOWER(nickname));
COMMIT;
