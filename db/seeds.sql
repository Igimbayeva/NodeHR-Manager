INSERT INTO department (name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Interdepartmental"),
        ("Sales"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Engineering Manager", 120000, 1),
        ("Engineering Lead", 100000, 1),
        ("Staff Engineer", 85000, 1),
        ("Finance Manager", 85000, 2),
        ("Accountant", 75000, 2),
        ("Brand Advocate Manager", 95000, 3),
        ("Brand Advocate Sr. Analyst", 85000, 3),
        ("Brand Advocate Analyst", 70000, 3),
        ("Sales Manager", 75000, 4),
        ("Salesperson", 65000, 4),
        ("Legal Manager", 110000, 5),
        ("Lawyer", 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Alex', 'Johnson',  1, NULL),
        ('Emily', 'Davis',  2, 1),
        ('Michael', 'Brown',  3, 1), 
        ('Sarah', 'Miller',  4, NULL), 
        ('David', 'Wilson',  5, 4),
        ('Sophia', 'Moore',  6, NULL), 
        ('James', 'Taylor',  7, 6), 
        ('Olivia', 'Anderson',  8, 6), 
        ('Daniel', 'Thomas',  9, NULL), 
        ('Emma', 'Jackson',  10, 9), 
        ('Christopher', 'White',  11, NULL), 
        ('Grace', 'Harris',  12, 11);