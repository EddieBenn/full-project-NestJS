# Apple Rental Service API

[Project URL](https://nestjs-complete-api.onrender.com) | [API Documentation](https://nestjs-complete-api.onrender.com/documentationView#)

## Project Overview
The Apple Rental Service is a comprehensive NestJS-based backend system designed to manage Apple device rentals with installment payment options. The platform features a complete role-based access control system with Admin, Agent, and User roles, enabling efficient management of rental operations across multiple cities. The system includes automated agent assignment, location-based tracking, Apple ID generation, and integrated WhatsApp notifications via Twilio.

## Features
- **Multi-Role Authentication**: Secure JWT-based authentication with role-based access control (Admin, Agent, User)
- **Automated Agent Assignment**: Intelligent agent assignment based on workload and location
- **Location-Based Management**: City-specific tracking with automated Apple ID generation
- **User Management**: Complete CRUD operations for prospects with agent assignments
- **WhatsApp Integration**: Automated agreement notifications via Twilio
- **Email Notifications**: Automated password delivery via Nodemailer
- **Agent Reassignment**: Flexible reassignment of users between agents
- **Password Management**: Secure password reset functionality for all user types
- **Cookie-Based Sessions**: HTTPOnly cookies for enhanced security
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Rate Limiting**: Protection against abuse with express-rate-limit
- **Transaction Management**: Database transactions with typeorm-transactional
- **Comprehensive Validation**: Request validation with class-validator and class-transformer

## Table of Contents
Installation<br />
Environment Variables<br />
Project Structure<br />
API Routes<br />
Admin Routes<br />
Agent Routes<br />
User Routes<br />
Location Counter Routes<br />
Twilio Routes<br />
Technologies Used<br />

## Installation
To install and run the project locally:

#### Clone the repository:

```bash
git clone https://github.com/EddieBenn/full-project-NestJS.git
```

#### Navigate into the project directory:

```bash
cd full-project-NestJS
```

#### Install dependencies:

```bash
npm install
```

#### Create a .env file in the root directory (see the Environment Variables section)

#### Build the project:

```bash
npm run build
```

#### Start the development server:

```bash
npm run start:dev
```

#### Start the production server:

```bash
npm run start:prod
```

## Environment Variables
Create a .env file in the root directory with the following variables:

```env
# SERVER
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=1h

# EMAIL
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# DEVELOPMENT DATABASE
DB_NAME=your-database-name
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# TWILIO
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=+14155238886

# PRODUCTION DATABASE
PROD_PORT=5432
PROD_DB_NAME=your-prod-db
PROD_DB_HOST=your-prod-host
PROD_DB_PASSWORD=your-prod-password
PROD_DB_USERNAME=your-prod-username
PROD_DB_SSL=true
```

## Project Structure

```
├── src
│   ├── admin
│   │   ├── dto
│   │   ├── entities
│   │   ├── admin.controller.ts
│   │   ├── admin.module.ts
│   │   └── admin.service.ts
│   ├── agents
│   │   ├── dto
│   │   ├── entities
│   │   ├── agents.controller.ts
│   │   ├── agents.module.ts
│   │   └── agents.service.ts
│   ├── auth
│   │   ├── dto
│   │   ├── auth.controller.ts
│   │   ├── auth.decorator.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── password-match.pipe.ts
│   │   ├── password-omit.interceptor.ts
│   │   ├── role.decorator.ts
│   │   └── role.guard.ts
│   ├── filters
│   │   ├── exception-filter.ts
│   │   └── query-filter.ts
│   ├── location-counter
│   │   ├── dto
│   │   ├── entities
│   │   ├── location-counter.controller.ts
│   │   ├── location-counter.module.ts
│   │   └── location-counter.service.ts
│   ├── twilio
│   │   ├── dto
│   │   ├── twilio.controller.ts
│   │   ├── twilio.module.ts
│   │   └── twilio.service.ts
│   ├── users
│   │   ├── dto
│   │   ├── entities
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── utils
│   │   ├── nodemailer-config.ts
│   │   └── utility-service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── base.entity.ts
│   ├── datasource.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── ormconfig.ts
├── package.json
├── prod-ormconfig.ts
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

## API Routes

#### Admin Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/admin</td>
      <td>Create a new admin</td>
      <td>No</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/admin</td>
      <td>Get all admins with pagination</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/admin/:id</td>
      <td>Get admin by ID</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/admin/:id</td>
      <td>Update admin details</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/admin/login</td>
      <td>Admin login</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/admin/logout</td>
      <td>Admin logout</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/admin/forgot-password</td>
      <td>Reset admin password</td>
      <td>No</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/admin/:id</td>
      <td>Delete admin</td>
      <td>Admin</td>
    </tr>
  </tbody>
</table>

#### Agent Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/agents</td>
      <td>Create a new agent</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/agents</td>
      <td>Get all agents with pagination</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/agents/:id</td>
      <td>Get agent by ID</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/agents/:id</td>
      <td>Update agent details</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/agents/login</td>
      <td>Agent login</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/agents/logout</td>
      <td>Agent logout</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/agents/forgot-password</td>
      <td>Reset agent password</td>
      <td>No</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/agents/:id</td>
      <td>Delete agent</td>
      <td>Admin</td>
    </tr>
  </tbody>
</table>

#### User Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/users</td>
      <td>Create a new user with automated agent assignment</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/users</td>
      <td>Get all users with pagination and filters</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/users/:id</td>
      <td>Get user by ID</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/users/:id</td>
      <td>Update user details</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/users/reassign</td>
      <td>Reassign all users of an agent</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/users/reassign-user/:id</td>
      <td>Reassign one user to a new agent</td>
      <td>Admin/Agent</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/users/login</td>
      <td>User login</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/users/logout</td>
      <td>User logout</td>
      <td>No</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/users/forgot-password</td>
      <td>Reset user password</td>
      <td>No</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/users/:id</td>
      <td>Delete user</td>
      <td>Admin/Agent</td>
    </tr>
  </tbody>
</table>

#### Location Counter Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/location-counter</td>
      <td>Create location counter for city</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/location-counter</td>
      <td>Get all location counters</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/location-counter/:id</td>
      <td>Get location counter by ID</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/location-counter/:id</td>
      <td>Update location counter</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/location-counter/:id</td>
      <td>Delete location counter</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>

#### Twilio Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/twilio/send-whatsapp</td>
      <td>Send WhatsApp message with media attachment</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>

## Technologies Used

<ul>
<li>NestJS - Progressive Node.js framework</li>
<li>TypeScript - Type-safe JavaScript</li>
<li>TypeORM - ORM for TypeScript and JavaScript</li>
<li>PostgreSQL - Relational database</li>
<li>Passport JWT - JWT authentication strategy</li>
<li>class-validator - Validation decorators</li>
<li>class-transformer - Object transformation</li>
<li>bcryptjs - Password hashing</li>
<li>Swagger/OpenAPI - API documentation</li>
<li>Nodemailer - Email service</li>
<li>Twilio - WhatsApp integration</li>
<li>cookie-parser - Cookie parsing middleware</li>
<li>express-rate-limit - Rate limiting</li>
<li>moment - Date/time manipulation</li>
<li>typeorm-transactional - Transaction management</li>
<li>Jest - Testing framework</li>
<li>ESLint - Code linting</li>
<li>Prettier - Code formatting</li>
</ul>

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
