CREATE DATABASE school;

\c school;

CREATE TABLE school (
  Id INT PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(255),
  directorName VARCHAR(100)
);

/* Fake school data */
INSERT INTO school (Id, name, address, directorName) VALUES
(1, 'Greenwood High', '123 Elm St', 'John Doe'),
(2, 'Sunnydale Elementary', '456 Oak St', 'Jane Smith'),
(3, 'Riverside Middle', '789 Pine St', 'Emily Johnson');