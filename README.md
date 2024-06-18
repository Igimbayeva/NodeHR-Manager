# NodeHR-Manager

NodeHR-Manager is a command-line application built with Node.js and PostgreSQL that allows users to manage employee information within departments and roles.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)
- [Walkthrough Video](#walkthrough-video)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and run the NodeHR-Manager application locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd NodeHR-Manager
   ```

2. **Install dependencies:**

   Ensure Node.js and npm are installed on your machine. Then, install dependencies using npm:

   ```bash
   npm install
   ```

3. **Set up the database:**

   - Ensure PostgreSQL is installed and running.
   - Create a PostgreSQL database and note down the connection URL.
   - Modify the database connection details in `db/index.js` file to match your PostgreSQL configuration.

4. **Start the application:**

   Once everything is set up, start the application with:

   ```bash
   Node index.js
   ```

## Usage

- Upon starting the application, you will be presented with a series of prompts in the command line interface.
- Navigate through the prompts using arrow keys and select the desired actions (e.g., view employees, add employees, update roles).
- Follow the instructions provided by the prompts to interact with the NodeHR-Manager functionalities.

## Features

- **View Employees:** Display a list of all employees or filter by department.
- **Add Employee:** Add a new employee with details such as name, role, and manager.
- **Update Employee Role:** Change the role of an existing employee.
- **Remove Employee:** Delete an employee from the database.
- **View Departments:** List all departments and their details.
- **Add Department:** Create a new department.
- **Remove Department:** Delete a department.
- **View Roles:** List all available roles and their details.
- **Add Role:** Create a new role.
- **Remove Role:** Delete a role.
- **View Utilized Budget By Department:** Display the total utilized budget of a department based on employee salaries.

## Database Schema

The application's database schema consists of the following tables:

- **Employees:** Stores information about employees including id, first name, last name, role id, and manager id.
- **Roles:** Contains details about employee roles such as id, title, salary, and department id.
- **Departments:** Stores department information including id and name.

The relationships between these tables are established using foreign key constraints.

## Technologies Used

- **Node.js:** A JavaScript runtime environment for executing server-side code.
- **PostgreSQL:** A powerful, open-source relational database system.
- **Inquirer:** A popular npm package for creating command-line interfaces with interactive prompts.

## Walkthrough Video

The [video walkthough](https://drive.google.com/file/d/1sCLNN5CTOqBW9rh7qk706vJ_oEBhi9Ba/view)covers basic functionalities, including adding employees, updating roles, and viewing department budgets.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and create a pull request. <br>
For major changes, please open an issue first to discuss suggested changes.

## License

This project is licensed under the MIT License.

---

