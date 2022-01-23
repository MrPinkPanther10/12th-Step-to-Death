USE employee_list;

INSERT INTO department (name)
VALUES 
('Information Systems and Technology'),
('Finance'),
('Legal'),
('Human Resources'),
('Security'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 90000, 1),
('Accountant', 70000, 2),
('Paralegal', 50000, 3),
('Manager', 70000, 4),
('Engineer', 90000, 5),
('Sales Rep', 40000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Wick', 1, 458),
('Ronald', 'McDonald', 2, 276),
('David', 'Cook', 3, 486),
('Maria', 'Hill', 4, 126),
('Steve', 'Martin', 5, 724),
('Taylor', 'Swift', 6, 157);