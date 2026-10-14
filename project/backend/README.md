# Smart Campus Bus Management System — Backend

A Spring Boot REST API for managing campus transportation data. The backend provides CRUD operations for buses, routes, drivers, students, and schedules, using MySQL as the database.

## Features

- **Bus Management:** Add, view, update, and delete bus records.
- **Route Management:** Manage route names, starting points, destinations, and stops.
- **Driver Management:** Store driver details, phone numbers, license numbers, and addresses.
- **Student Management:** Manage student names, roll numbers, departments, phone numbers, and academic years.
- **Schedule Management:** Manage bus numbers, routes, departure times, arrival times, and days.
- **Database Integration:** Store and retrieve records using MySQL.

## Technologies Used

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL 8
- Maven
- REST API

## Prerequisites

Install the following software before running the backend:

- Java 17 or later
- MySQL Server 8
- Maven, or use the included Maven Wrapper

## Database Configuration

Create the database in MySQL:

```sql
CREATE DATABASE campus_bus;
```

Configure the database connection in `src/main/resources/application.properties`.

Set the following environment variables for database connectivity:

- `DB_URL` — JDBC URL of the MySQL database
- `DB_USERNAME` — MySQL username
- `DB_PASSWORD` — MySQL password

**Security note:** Never commit database passwords or other sensitive credentials to GitHub.

## Run the Backend Locally

### 1. Clone the repository

```bash
git clone https://github.com/Sanjanabandari/smart-campus-bus-backend.git
```

### 2. Enter the project directory

```bash
cd smart-campus-bus-backend
```

### 3. Start the application on Windows

Using the included Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Alternatively, if Maven is installed:

```powershell
mvn spring-boot:run
```

### 4. Access the backend

The application uses port `8080` by default, unless configured otherwise.

Base URL:

```text
http://localhost:8080
```

## API Modules

The application supports CRUD operations for the following modules:

- **Buses:** Create, retrieve, update, and delete bus records.
- **Routes:** Manage campus routes and stops.
- **Drivers:** Manage driver information.
- **Students:** Manage student records.
- **Schedules:** Manage bus schedules.

## Frontend Repository

https://github.com/Sanjanabandari/smart-campus-bus-frontend

## Backend Repository

https://github.com/Sanjanabandari/smart-campus-bus-backend

## Project Status

The backend has been tested locally with the React frontend and MySQL database. Online deployment is pending.
