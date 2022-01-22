// Required Modules
const mysql = require('mysql');
const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');

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