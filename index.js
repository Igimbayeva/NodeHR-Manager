const { prompt } = require('inquirer');
const db = require('./db');

// Initialize the application
function init() {
  loadMainPrompts();
}

// Main menu prompts
function loadMainPrompts() {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        { name: 'View All Employees', value: 'VIEW_EMPLOYEES' },
        { name: 'View All Employees By Department', value: 'VIEW_EMPLOYEES_BY_DEPARTMENT' },
        { name: 'View All Employees By Manager', value: 'VIEW_EMPLOYEES_BY_MANAGER' },
        { name: 'Add Employee', value: 'ADD_EMPLOYEE' },
        { name: 'Remove Employee', value: 'REMOVE_EMPLOYEE' },
        { name: 'Update Employee Role', value: 'UPDATE_EMPLOYEE_ROLE' },
        { name: 'Update Employee Manager', value: 'UPDATE_EMPLOYEE_MANAGER' },
        { name: 'View All Roles', value: 'VIEW_ROLES' },
        { name: 'Add Role', value: 'ADD_ROLE' },
        { name: 'Remove Role', value: 'REMOVE_ROLE' },
        { name: 'View All Departments', value: 'VIEW_DEPARTMENTS' },
        { name: 'Add Department', value: 'ADD_DEPARTMENT' },
        { name: 'Remove Department', value: 'REMOVE_DEPARTMENT' },
        { name: 'View Total Utilized Budget By Department', value: 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT' },
        { name: 'Quit', value: 'QUIT' },
      ],
    },
  ]).then(handleChoice);
}

// Function to handle user choices
function handleChoice({ choice }) {
  switch (choice) {
    case 'VIEW_EMPLOYEES':
      viewEmployees();
      break;
    case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
      viewEmployeesByDepartment();
      break;
    case 'VIEW_EMPLOYEES_BY_MANAGER':
      viewEmployeesByManager();
      break;
    case 'ADD_EMPLOYEE':
      addEmployee();
      break;
    case 'REMOVE_EMPLOYEE':
      removeEmployee();
      break;
    case 'UPDATE_EMPLOYEE_ROLE':
      updateEmployeeRole();
      break;
    case 'UPDATE_EMPLOYEE_MANAGER':
      updateEmployeeManager();
      break;
    case 'VIEW_ROLES':
      viewRoles();
      break;
    case 'ADD_ROLE':
      addRole();
      break;
    case 'REMOVE_ROLE':
      removeRole();
      break;
    case 'VIEW_DEPARTMENTS':
      viewDepartments();
      break;
    case 'ADD_DEPARTMENT':
      addDepartment();
      break;
    case 'REMOVE_DEPARTMENT':
      removeDepartment();
      break;
    case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
      viewUtilizedBudgetByDepartment();
      break;
    case 'QUIT':
      quit();
      break;
    default:
      console.log('Invalid choice');
      loadMainPrompts();
  }
}

// Function to view all employees
function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing employees:', err.message);
      loadMainPrompts();
    });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which department would you like to see employees for?',
          choices: departmentChoices,
        },
      ]);
    })
    .then(({ departmentId }) => db.findAllEmployeesByDepartment(departmentId))
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing employees by department:', err.message);
      loadMainPrompts();
    });
}

// Function to view employees by manager
function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const managerChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Which employee do you want to see direct reports for?',
          choices: managerChoices,
        },
      ]);
    })
    .then(({ managerId }) => db.findAllEmployeesByManager(managerId))
    .then(({ rows }) => {
      console.log('\n');
      if (rows.length === 0) {
        console.log('The selected employee has no direct reports.');
      } else {
        console.table(rows);
      }
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing employees by manager:', err.message);
      loadMainPrompts();
    });
}

// Function to add an employee
function addEmployee() {
  prompt([
    {
      name: 'first_name',
      message: "What is the employee's first name?",
    },
    {
      name: 'last_name',
      message: "What is the employee's last name?",
    },
    {
      type: 'list',
      name: 'role_id',
      message: "What is the employee's role?",
      choices: () => db.findAllRoles().then(({ rows }) => rows.map(({ id, title }) => ({ name: title, value: id }))),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: "Who is the employee's manager?",
      choices: () => db.findAllEmployees().then(({ rows }) => [{ name: 'None', value: null }, ...rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }))]),
    },
  ])
    .then(employee => db.createEmployee(employee))
    .then(() => console.log('Employee added successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error adding employee:', err.message);
      loadMainPrompts();
    });
}

// Function to remove an employee
function removeEmployee() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee do you want to remove?',
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => db.removeEmployee(employeeId))
    .then(() => console.log('Employee removed successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error removing employee:', err.message);
      loadMainPrompts();
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee's role do you want to update?",
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => {
      db.findAllRoles()
        .then(({ rows }) => {
          const roleChoices = rows.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          return prompt([
            {
              type: 'list',
              name: 'roleId',
              message: 'Which role do you want to assign the selected employee?',
              choices: roleChoices,
            },
          ]);
        })
        .then(({ roleId }) => db.updateEmployeeRole(employeeId, roleId))
        .then(() => console.log('Employee role updated successfully.'))
        .then(loadMainPrompts)
        .catch(err => {
          console.log('Error updating employee role:', err.message);
          loadMainPrompts();
        });
    })
    .catch(err => {
      console.log('Error updating employee role:', err.message);
      loadMainPrompts();
    });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee's manager do you want to update?",
          choices: employeeChoices,
        },
      ]);
    })
    .then(({ employeeId }) => {
      db.findAllPossibleManagers(employeeId)
        .then(({ rows }) => {
          const managerChoices = [{ name: 'None', value: null }, ...rows.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          }))];

          return prompt([
            {
              type: 'list',
              name: 'managerId',
              message: 'Which employee do you want to set as manager for the selected employee?',
              choices: managerChoices,
            },
          ]);
        })
        .then(({ managerId }) => db.updateEmployeeManager(employeeId, managerId))
        .then(() => console.log('Employee manager updated successfully.'))
        .then(loadMainPrompts)
        .catch(err => {
          console.log('Error updating employee manager:', err.message);
          loadMainPrompts();
        });
    })
    .catch(err => {
      console.log('Error updating employee manager:', err.message);
      loadMainPrompts();
    });
}

// Function to view all roles
function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing roles:', err.message);
      loadMainPrompts();
    });
}

// Function to add a role
function addRole() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name,
        value: id,
      }));

      return prompt([
        {
          name: 'title',
          message: 'What is the name of the role?',
        },
        {
          name: 'salary',
          message: 'What is the salary of the role?',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Which department does the role belong to?',
          choices: departmentChoices,
        },
      ]);
    })
    .then(role => db.createRole(role))
    .then(() => console.log('Role added successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error adding role:', err.message);
      loadMainPrompts();
    });
}

// Function to remove a role
function removeRole() {
  db.findAllRoles()
    .then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role do you want to remove? (Warning: This will also remove associated employees)',
          choices: roleChoices,
        },
      ]);
    })
    .then(({ roleId }) => db.removeRole(roleId))
    .then(() => console.log('Role removed successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error removing role:', err.message);
      loadMainPrompts();
    });
}

// Function to view all departments
function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing departments:', err.message);
      loadMainPrompts();
    });
}

// Function to add a department
function addDepartment() {
  prompt([
    {
      name: 'name',
      message: 'What is the name of the department?',
    },
  ])
    .then(department => db.createDepartment(department))
    .then(() => console.log('Department added successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error adding department:', err.message);
      loadMainPrompts();
    });
}

// Function to remove a department
function removeDepartment() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name,
        value: id,
      }));

      return prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which department do you want to remove? (Warning: This will also remove associated roles and employees)',
          choices: departmentChoices,
        },
      ]);
    })
    .then(({ departmentId }) => db.removeDepartment(departmentId))
    .then(() => console.log('Department removed successfully.'))
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error removing department:', err.message);
      loadMainPrompts();
    });
}

// Function to view total utilized budget by department
function viewUtilizedBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(({ rows }) => {
      console.log('\n');
      console.table(rows);
    })
    .then(loadMainPrompts)
    .catch(err => {
      console.log('Error viewing department budgets:', err.message);
      loadMainPrompts();
    });
}

// Function to exit the application
function quit() {
  console.log('Goodbye!');
  process.exit();
}

// Start the application
init();
