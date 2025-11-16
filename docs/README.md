# Volunteer Sign-up Website Documentation

## Overview

This website aims to simplify the process of searching for local volunteer opportunities and signing up for them.

## Containing as of Week 9:

- Login/register pages for rudimentary user sessions and storing temporary data
<img width="1365" height="566" alt="image" src="https://github.com/user-attachments/assets/5a5b5d02-651e-4a25-bf9f-ed97012cdda7" />
<img width="1365" height="595" alt="image" src="https://github.com/user-attachments/assets/39c40507-289e-4283-9d18-c68103a4e40b" />
- Home page for storing all active opportunities that can be joined
<img width="1365" height="594" alt="image" src="https://github.com/user-attachments/assets/5fb742df-b466-4c09-98b2-5eacc13a0b41" />
- Dashboard for storing all joined opportunities, expired and active
<img width="1365" height="600" alt="image" src="https://github.com/user-attachments/assets/21613095-d9b5-4a84-9755-8e911a401f34" />
- Profile page for viewing account information (currently the inputs from the login/register pages) and logging out
<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/62e8478e-355f-4368-a0cb-ecea7017ce03" />

## Containing as of Week 10:

- Proper data persistence with connection to Supabase
- Change Password/Create Opportunity pages for managing persisting data
- CRUD slice:
  - CREATE Opportunity
  - READ Opportunities (list)
  - UPDATE Opportunities (functional, but not implemented in UI)
  - DELETE Opportunities (functional, but not implemented in UI)

Row-level security (RLS) is not yet enabled. In the future, once authentication is added, I will add proper password hashing and RLS permissions, utilizing the existing `id` column in the `users` table. Functionally, the data for RLS to work has been implemented, but the permissions have not been set up yet and it is not enabled. Once enabled, RLS would be set up to only allow authenticated users to view their own account information outside of first/last names, and they would only be able to edit their own account information. Opportunities will not let users edit them without being the user defined in the opportunity's `created_by` column.

## Containing as of Week 11:

- Password hashing
- Joining/leaving opportunities
- "Welcome back" indicator in homepage

RLS has not yet been enabled, due to it requiring significant refactoring of how user data is managed. It may be added in the future, depending on what time allows, but having bcrypt hashing alongside user sessions and secure cookies should be reasonably adequate for the time being (though not exemplary) given the anonymous key for Supabase is not shared.

This is based on a teaching template for building web applications with:
- **Node.js 20**: JavaScript runtime
- **Express 4**: Web application framework
- **EJS**: Templating engine
- **PostgreSQL**: Relational database
- **Vanilla JavaScript**: Client-side scripting (no frameworks)

## Security Features

- **Helmet**: Sets security-related HTTP headers
- **express-session**: Secure session management
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Parameterized SQL Queries**: SQL injection prevention

## Project Structure

```
.
├── src/
│   ├── server.js           # Server entry point
│   ├── app.js              # Express app configuration
│   ├── routes/             # Route definitions
│   │   ├── index.js        # Main routes
│   │   ├── opportunity.js  # Opportunity routes
│   │   └── users.js        # User routes
│   ├── controllers/        # Request handlers
│   │   ├── indexController.js
│   │   ├── opportunityController.js
│   │   └── userController.js
│   ├── models/             # Database models
│   │   ├── db.js           # Database connection
│   │   ├── supabase.js     # Supabase connection
│   │   ├── opportunity.js  # Opportunity model
│   │   └── User.js         # User model
│   ├── views/              # EJS templates
│   │   ├── users/          # EJS views for user sessions (login/logout)
│   │   │   ├── login.ejs   # Login page
│   │   │   └── register.ejs # Register page
│   │   ├── opportunities/  # Opportunity views
│   │   │   └── create.ejs  # Create page
│   │   ├── index.ejs       # Home page
│   │   ├── dashboard.ejs   # Dashboard page
│   │   ├── profile.ejs     # Profile page
│   │   ├── error.ejs       # Error page
│   │   └── layout.ejs      # Layout template (optional)
│   └── public/             # Static files
│       ├── css/
│       │   └── style.css   # Stylesheet
│       ├── img/            # Temporary placeholder images
│       │   ├── default_pfp.svg
│       │   └── zybooks_cat.jpg
│       └── js/
│           └── main.js     # Client-side JavaScript
├── db/
│   ├── migrate.js          # Migration runner
│   ├── seed.js             # Seed runner
│   ├── reset.js            # Database reset script
│   ├── migrations/         # Database migrations
│   │   ├── 001_create_users_table.sql
│   │   └── 002_create_opportunities_table.sql
│   └── seeds/              # Database seeds
│       ├── 001_seed_users.sql
│       └── 002_seed_opportunities.sql
├── docs/                   # Documentation
│   ├── db/                 # Example database entries in SQL and CSV files
│   ├── README.md           # This file
│   ├── SETUP.md            # Setup instructions
│   └── ARCHITECTURE.md     # Architecture overview
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies and scripts
└── README.md               # Project README
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture information.

## Development

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with auto-reload
- `npm run lint`: Check code for linting errors
- `npm run lint:fix`: Fix linting errors automatically
- `npm run format`: Format code with Prettier

### Code Style

This project uses:
- **ESLint** for JavaScript linting
- **Prettier** for code formatting

Run `npm run lint` to check for issues and `npm run format` to format your code.

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file. Use `.env.example` as a template.
2. **Password Hashing**: Always hash passwords using bcrypt before storing.
3. **Input Validation**: Validate and sanitize all user input.
4. **SQL Injection**: Use parameterized queries ($1, $2, etc.) for all database operations.
5. **CSRF Protection**: Include CSRF tokens in all forms.
6. **Session Security**: Use secure, httpOnly cookies in production.

## Database Operations

### Migrations

Migrations are SQL files in `docs/db/` that create or modify database tables.

To create a new migration:
1. Create a new file: `docs/db/schema_description.sql`
2. Write your SQL (CREATE TABLE, ALTER TABLE, etc.)
3. Run your SQL in your Supabase project

### Seeds

Seeds are CSV files in `docs/db/` that populate the database with initial or test data.

To create a new seed:
1. Create a new file: `docs/db/seed_description.csv`
2. Write your sample data
3. Import this file into your Supabase project in the corresponding table

### Parameterized Queries

Always use parameterized queries to prevent SQL injection:

```javascript
// ❌ Bad (SQL injection vulnerable)
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Good (parameterized)
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

## Contributing

When contributing to this project:
1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test your changes thoroughly
4. Update documentation as needed

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs/reference/javascript)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Helmet Documentation](https://helmetjs.github.io/)
