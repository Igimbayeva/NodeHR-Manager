-- Connect to the database
\c employees

INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Lead', 105000, 1),
  ('Salesperson', 85000, 1),
  ('Lead Engineer', 155000, 2),
  ('Software Engineer', 125000, 2),
  ('Account Manager', 165000, 3),
  ('Accountant', 130000, 3),
  ('Legal Team Lead', 255000, 4),
  ('Lawyer', 195000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Emma', 'Smith', 1, NULL),
  ('Olivia', 'Johnson', 2, 1),
  ('Ava', 'Williams', 3, NULL),
  ('Sophia', 'Brown', 4, 3),
  ('Isabella', 'Jones', 5, NULL),
  ('Mia', 'Garcia', 6, 5),
  ('Charlotte', 'Miller', 7, NULL),
  ('Amelia', 'Davis', 8, 7);
