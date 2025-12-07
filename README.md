# Volunteer Sign-up Website

This website aims to simplify the process of searching for local volunteer opportunities and signing up for them.

Featuring:
- Joinable and creatable volunteer opportunities
- User accounts with authentication
- Supabase integration with bcrypt hashing for security
- Statistics for volunteer work in the US

A user can create or log into an account, view opportunities, or view statistics. A logged in user can create, join, and leave opportunities, change their password, or log out. This app facilitates all of these features with Supabase integration and external API requests.

## As of Week 9:

- Login/register pages for rudimentary user sessions and storing temporary data
<img width="1365" height="566" alt="image" src="https://github.com/user-attachments/assets/5a5b5d02-651e-4a25-bf9f-ed97012cdda7" />
<img width="1365" height="595" alt="image" src="https://github.com/user-attachments/assets/39c40507-289e-4283-9d18-c68103a4e40b" />
- Home page for storing all active opportunities that can be joined
<img width="1365" height="594" alt="image" src="https://github.com/user-attachments/assets/5fb742df-b466-4c09-98b2-5eacc13a0b41" />
- Dashboard for storing all joined opportunities, expired and active
<img width="1365" height="600" alt="image" src="https://github.com/user-attachments/assets/21613095-d9b5-4a84-9755-8e911a401f34" />
- Profile page for viewing account information (currently the inputs from the login/register pages) and logging out
<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/62e8478e-355f-4368-a0cb-ecea7017ce03" />

## As of Week 10:

- Proper data persistence with connection to Supabase
- Change Password/Create Opportunity pages for managing persisting data
- CRUD slice:
  - CREATE Opportunity
  - READ Opportunities (list)
  - UPDATE Opportunities (functional, but not implemented in UI)
  - DELETE Opportunities (functional, but not implemented in UI)

Row-level security (RLS) is not yet enabled. In the future, once authentication is added, I will add proper password hashing and RLS permissions, utilizing the existing `id` column in the `users` table. Functionally, the data for RLS to work has been implemented, but the permissions have not been set up yet and it is not enabled. Once enabled, RLS would be set up to only allow authenticated users to view their own account information outside of first/last names, and they would only be able to edit their own account information. Opportunities will not let users edit them without being the user defined in the opportunity's `created_by` column.

## As of Week 11:

- Password hashing
- Joining/leaving opportunities
- "Welcome back" indicator in homepage

RLS has not yet been enabled, due to it requiring significant refactoring of how user data is managed. It may be added in the future, depending on what time allows, but having bcrypt hashing alongside user sessions and secure cookies should be reasonably adequate for the time being (though not exemplary) given the anonymous key for Supabase is not shared.

## As of Week 12:

- Statistics page fetching data from the US Census API
Docs:
- https://api.census.gov/data/2023/cps/volunteer/sep/variables.html
- https://www.census.gov/data/developers/guidance/api-user-guide.html
Using the endpoint:
- https://api.census.gov/data/2023/cps/volunteer/sep

When the Statistics page is first opened, API requests are sent by the server to this endpoint to fetch statistics on volunteering in the US, conducted by the US Census in September 2023. This response is then cached and reused for future requests. These results are then processed by the server and rendered to the client.

No API keys are necessary for this API. Only the URL is required for a request.

<img width="1365" height="570" alt="image" src="https://github.com/user-attachments/assets/06feddbe-61eb-4355-a5f7-e96bed13f57a" />

## As of week 14:

- Improved documentation
- Added method comments and stronger error handling in controllers

## Error handling

This website expects to experience database and external API errors.
All database and external API calls are wrapped in try-catch blocks to handle errors gracefully.
Errors are either hidden from the user, shown in brief toasts to the user, or shown as a dedicated page to the user.

## Frontend features

## Backend features

- **Node.js 20** + **Express 4** - Modern JavaScript backend
- **EJS** - Server-side templating
- **Supabase** - Reliable database API
- **Security First** - Helmet, CSRF protection, secure sessions
- **Clean Code** - ESLint, Prettier, best practices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/UWO-CS346-Fall-25/cs346f25-volunteer-sign-up-app
   cd cs346f25-volunteer-sign-up-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up Supabase database**
   ```bash
   # Create database (adjust credentials as needed)
   ```

5. **Generate Schema**
   ```bash
   docs/db/[...].sql
   ```

6. **Seed database (optional)**
   ```bash
   docs/db/[...].csv
   ```

7. **Start the application**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:3000
   ```

## Project Structure

This website uses MVC for clean and efficient design.
(Model - View - Controller)

Models handle database interaction and API requests, and manage data
- Opportunity: Database management for handling and sorting opportunities
- User: Database management for user accounts
- Statistics: US Census API requests for fetching volunteer statistics
- supabase: Preparing the Supabase integration client

Views handle presenting data to the user through EJS templates and HTML/CSS
- Index: home page displaying optionally filtered/sorted opportunities
- Dashboard: user page displaying optionally sorted joined opportunities
- Profile: user page showing account data
- Error: fallback page for displaying errors
- Statistics: page for showing fetched volunteer data
(And other static pages)

Controllers handle business logic for processing requests and responses
- Index Controller: handles requests for home and logged in user pages
- Opportunity Controller: handles requests for managing opportunities
- Statistics Controller: handles requests for viewing volunteer statistics
- User Controller: handles requests for managing accounts

Requests are routed through controllers, in this pattern:
- Client sends HTTP request
- Server matches request to route
- Server calls appropriate controller function
- Controller calls appropriate model functions
- Models reach out to Supabase or external API
- Controller renders retrieved data to EJS templates via a view
- Controller sends back HTML data from view

```
├── src/
│   ├── server.js           # Server entry point
│   ├── app.js              # Express app configuration
│   ├── routes/             # Route definitions
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── views/              # EJS templates
│   └── public/             # Static files (CSS, JS, images)
├── db/
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Database seeds
│   ├── migrate.js          # Migration runner
│   ├── seed.js             # Seed runner
│   └── reset.js            # Database reset script
├── docs/                   # Documentation
│   ├── db/                 # SQL and seeds for Supabase
│   ├── README.md           # Documentation overview
│   ├── SETUP.md            # Setup guide
│   └── ARCHITECTURE.md     # Architecture details
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
└── package.json            # Dependencies and scripts
```

## License

ISC
