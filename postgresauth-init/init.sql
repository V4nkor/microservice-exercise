CREATE DATABASE user;

\c user;

CREATE TABLE user (
  Id INT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(255)
);

/* Fake user data */
INSERT INTO user (Id, username, password) VALUES
(1, 'admin', 'admin'),
(2, 'user', 'user'),
(3, 'guest', 'guest'),
(4, 'test', 'test'),
(5, 'mmorgat', 'password');