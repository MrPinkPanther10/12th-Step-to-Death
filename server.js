// Required Modules
const mysql = require('mysql');
const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const e = require('express');

const db = mysql.createConnection({
    host: 'localhost',
    // Change it to your MySQL username
    user: 'root',
    // Change it to your MySQL password
    password: '',
    database: 'employee_list'
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    trackerOptions();
});


function trackerOptions() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Welcome to the Employee Database, what would you like to do?",
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add department',
            'Add role',
            'Add an employee',
            'Update employee role',
            'Update employee manager',
            'View employees by manager',
            'Delete department',
            'Delete role',
            'Delete employee',
            'View budget',
            'Cancel'
        ]
    }]).then(function(userInput) {
        switch (userInput.action) {
            case 'View all departments':
                viewDepartment();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewManagerEmployees();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete employee':
                deleteEmployee();
                break;
            case 'View budget':
                viewBudget();
                break;
            case 'Cancel':
                trackerOptions();
                break;
        }
    })
};

// View all departments
function viewDepartment() {
    var query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Departments:', res);
        trackerOptions();
    })
};

// View all roles
function viewRoles() {
    var query = 'SELECT * FROM role';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Roles:', res);
        trackerOptions();
    })
};

// View all employees
function viewEmployees() {
    var query = 'SELECT * FROM employee';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res);
        trackerOptions();
    })
};

// Add department
function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'newDepartment',
        message: 'What department would you like to add?'
    }]).then(function(answer) {
        db.query(
            'INSERT INTO department SET ?', {
                name: answer.newDepartment
            }
        );
        var query = 'SELECT * FROM department';
        db.query(query, function(err, res) {
            if (err) throw err;
            console.log('You just added a department');
            console.table('All Departments:', res);
            trackerOptions();
        })
    })
};

// Add role
function addRole() {
    db.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;

        inquirer.prompt([{
                name: 'newRole',
                type: 'input',
                message: 'What new role would you like to add?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role? (Enter a number)'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department would this role be assigned?',
                choices: function() {
                    var deptArray = [];
                    for (let i = 0; i < res.length; i++) {
                        deptArray.push(res[i].name);
                    }
                    return deptArray;
                }
            }
        ]).then(function(answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.department) {
                    department_id = res[a].id;
                }
            }
            db.query(
                'INSERT INTO role SET?', {
                    title: answer.newRole,
                    salary: answer.salary,
                    department_id: department_id
                },
                function(err, res) {
                    if (err) throw err;
                    console.log('You just added a new role!');
                    console.table('All Roles:', res);
                    trackerOptions();
                }
            )
        })
    })
};

// Add an employee
function addEmployee() {
    db.query('SELECT * FROM role', function(err, res) {
        if (err) throw err;

        inquirer.prompt([{
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name?"
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?"
            }, {
                name: 'role',
                type: 'list',
                choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is the employee's role?"
            },
            {
                name: 'manager_id',
                type: 'input',
                message: "What is the employee's manager's ID?"
            }
        ]).then(function(answer) {
            let role_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].title == answer.role) {
                    role_id = res[a].id;
                    console.log(role_id)
                }
            }
            db.query(
                'INSERT INTO employee SET ?', {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: role_id,
                    manager_id: answer.manager_id
                },
                function(err) {
                    if (err) throw err;
                    console.log('You just added an employee!');
                    trackerOptions();
                }
            )
        })
    })
};

// Update employee role
function updateEmployeeRole() {
    // get employee list for employee choices
    db.query('SELECT * FROM employee', function(err, emRes) {
        if (err) throw err;
        var employeeChoices = [];
        emRes.forEach(({ first_name, last_name, id }) => {
            employeeChoices.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        // get role list for role choices
        db.query('SELECT * FROM role', function(err, rolRes) {
            if (err) throw err;
            var roleChoices = [];
            rolRes.forEach(({ title, id }) => {
                roleChoices.push({
                    name: title,
                    value: id
                });
            });

            inquirer.prompt([{
                    name: 'emp_id',
                    type: 'list',
                    choices: employeeChoices,
                    message: "Which employee do you want to update?"
                },
                {
                    name: 'role_id',
                    type: 'list',
                    choices: roleChoices,
                    message: "What is the employee's new role?"
                }
            ]).then(function(answer) {
                db.query(
                    'UPDATE employee SET ? WHERE ?? = ?;', {
                        emp_id: answer.emp_id,
                        role_id: answer.role_id
                    },
                    function(err) {
                        if (err) throw err;
                        console.log("You just successfully updated employee's role!");
                        trackerOptions();
                    }
                )
            })
        })
    })
};



// Update employee's manager
function updateEmployeeManager() {
    // get employee list for employee choices
    db.query('SELECT * FROM employee', function(err, emRes) {
        if (err) throw err;
        var employeeChoices = [];
        emRes.forEach(({ first_name, last_name, id }) => {
            employeeChoices.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        // manager choices
        var managerChoices = [{
            name: 'None',
            value: 0
        }]; // what if the employee has no manager in the first place
        emRes.forEach(({ first_name, last_name, id }) => {
            managerChoices.push({
                name: first_name + " " + last_name,
                value: id
            })
        });

        inquirer.prompt([{
                name: 'emp_id',
                type: 'list',
                choices: employeeChoices,
                message: "Which employee do you want to update?"
            },
            {
                name: 'manager_id',
                type: 'list',
                choices: managerChoices,
                message: 'Which manager would you assign the employee to?'
            }
        ]).then(function(answer) {
            db.query(
                'UPDATE employee SET ? WHERE id = ?', {
                    emp_id: answer.emp_id,
                    manager_id: answer.manager_id
                },
                function(err) {
                    if (err) throw err;
                    console.log("You just successfully updated employee's manager")
                    trackerOptions();
                }
            )
        })
    })
};

// View employees by manager
function viewManagerEmployees() {
    // get employee list
    db.query("SELECT * FROM employee", (err, empRes) => {
        if (err) throw err;
        const employeeChoices = [{
            name: 'None',
            value: 0
        }];
        empRes.forEach(({ first_name, last_name, id }) => {
            employeeChoices.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        inquirer.prompt({
                name: 'manager_id',
                type: 'list',
                choices: employeeChoices,
                message: "Which manager do you want to see the employee's list?"
            }).then(response => {
                let manager_id, query;
                if (response.manager_id) {
                    query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
              R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
              FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
              LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
              LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
              WHERE E.manager_id = ?;`;
                } else {
                    manager_id = null;
                    query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
              R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
              FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
              LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
              LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
              WHERE E.manager_id is null;`;
                }
                db.query(query, [response.manager_id], (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    trackerOptions()
                });
            })
            .catch(err => {
                console.error(err);
            });
    });
};

// Delete department
function deleteDepartment() {
    db.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;

        inquirer.prompt({
            name: 'id',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: function() {
                var deptArray = [];
                for (let i = 0; i < res.length; i++) {
                    deptArray.push(res[i].id);
                }
                return deptArray;
            }
        }).then(response => {
            const query = `DELETE FROM department WHERE id = ?`;
            db.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} row(s) successfully deleted!`);
                trackerOptions();
            });
        })
    })
};

// Delete role
function deleteRole() {
    db.query('SELECT * FROM role', function(err, res) {
        if (err) throw err;

        inquirer.prompt({
            name: 'title',
            type: 'list',
            message: 'Which role would you like to delete?',
            choices: function() {
                var roleArray = [];
                for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                }
                return roleArray;
            }
        }).then(response => {
            const query = `DELETE FROM role WHERE title = ?`;
            db.query(query, [response.title], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} row(s) successfully deleted!`);
                trackerOptions();
            });
        })
    })
};

// Delete employee
function deleteEmployee() {
    db.query('SELECT * FROM employee', function(err, res) {
        if (err) throw err;

        inquirer.prompt({
            name: 'first_name',
            type: 'list',
            message: 'Which employee would you like to delete?',
            choices: function() {
                var empArray = [];
                for (let i = 0; i < res.length; i++) {
                    empArray.push(res[i].first_name);
                }
                return empArray;
            }
        }).then(response => {
            const query = `DELETE FROM employee WHERE first_name = ?`;
            db.query(query, [response.first_name], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} row(s) successfully deleted!`);
                trackerOptions();
            });
        })
    })
};

// View Budget
function viewBudget() {
    db.query('SELECT * FROM department', function(err, res) {
        if (err) throw err

        const depChoice = [];
        res.forEach(({ name, id }) => {
            depChoice.push({
                name: name,
                value: id
            });
        });

        inquirer.prompt({
            name: 'id',
            type: 'list',
            message: 'Which department budget would you like to view?',
            choices: depChoice
        }).then(response => {
            const query = `SELECT D.name, SUM(salary) AS budget FROM
            EMPLOYEE AS E LEFT JOIN ROLE AS R
            ON E.role_id = R.id
            LEFT JOIN DEPARTMENT AS D
            ON R.department_id = D.id
            WHERE D.id = ?
            `;
            db.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.table(res);
                trackerOptions();
            });
        })
    })
};