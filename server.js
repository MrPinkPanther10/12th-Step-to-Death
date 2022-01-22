// Required Modules
const db = require('./db/connection');
const express = require('express');
const cTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

// Create server application at port 3001
const PORT = process.env.PORT || 3001;
const app = express();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
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
            'Update employee role'
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
            default:
                break;
        }
    })
}