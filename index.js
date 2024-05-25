const { Client } = require('pg');
const inquirer = require('inquirer');
require('dotenv').config();

// Dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Database connection setup
const client = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

client.connect();

const mainMenu = async () => {
  const answers = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ],
  });

  switch (answers.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    default:
      client.end();
      console.log('Goodbye!');
  }
};

const viewAllDepartments = async () => {
  try {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (err) {
    console.error('Error viewing departments:', err);
  }
  mainMenu();
};

const viewAllRoles = async () => {
  try {
    const res = await client.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id');
    console.table(res.rows);
  } catch (err) {
    console.error('Error viewing roles:', err);
  }
  mainMenu();
};

const viewAllEmployees = async () => {
  try {
    const res = await client.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
             CASE WHEN manager.id IS NOT NULL THEN CONCAT(manager.first_name, ' ', manager.last_name) ELSE NULL END AS manager
      FROM employee 
      JOIN role ON employee.role_id = role.id 
      JOIN department ON role.department_id = department.id 
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error viewing employees:', err);
  }
  mainMenu();
};

const addDepartment = async () => {
  try {
    const answers = await inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    });
    await client.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
    console.log(`Department ${answers.name} added.`);
  } catch (err) {
    console.error('Error adding department:', err);
  }
  mainMenu();
};

const addRole = async () => {
  try {
    const departments = await client.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));
    
    const answers = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the name of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary of the role:',
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      }
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
    console.log(`Role ${answers.title} added.`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
  mainMenu();
};

const addEmployee = async () => {
  try {
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const employees = await client.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name of the employee:',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name of the employee:',
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the role for the employee:',
        choices: roleChoices,
      },
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the manager for the employee:',
        choices: managerChoices,
      }
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log(`Employee ${answers.first_name} ${answers.last_name} added.`);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
  mainMenu();
};

const updateEmployeeRole = async () => {
  try {
    const employees = await client.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const answers = await inquirer.prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      }
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log(`Employee role updated.`);
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
  mainMenu();
};

mainMenu();
