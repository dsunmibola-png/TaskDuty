# TaskDuty — Personal Task Manager

A responsive full-stack task manager built for the Techstudio
Internship Program, Online Stages 1–3.

The frontend follows the supplied Figma design. Users can register,
log in, manage their own tasks, and search tasks stored in MongoDB.

## Features

- Register, log in, and log out.
- Create, view, edit, and delete tasks.
- Mark tasks as completed or incomplete.
- Search task titles and descriptions without case sensitivity.
- Combine search with category and completion-status filters.
- Delay search requests by 300 ms while typing.
- Cancel outdated search requests.
- Show loading states, request errors, and empty results.
- Validate required fields and reject whitespace-only text.
- Prevent submitting past due dates.
- Save tasks to MongoDB and restrict access to their owner.
- Support desktop and mobile layouts.

## Tech Stack

### Frontend

- React and TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Fetch API

### Backend

- Node.js
- Express and TypeScript
- MongoDB Atlas and Mongoose
- bcryptjs
- JSON Web Tokens
- tsx for development

## Project Structure

- `client/src/Components/` — shared UI components.
- `client/src/Pages/` — home, authentication, task list, and forms.
- `client/src/lib/api.ts` — API requests and task-response mapping.
- `client/src/types/task.ts` — task types and categories.
- `server/src/config/` — database connection configuration.
- `server/src/controllers/` — authentication and task handlers.
- `server/src/middleware/` — authentication middleware.
- `server/src/models/` — user and task models.
- `server/src/routes/` — API routes.
- `server/src/utils/` — token and validation helpers.

## Prerequisites

- Node.js 22.12 or newer within a supported release line, and npm.
- Git.
- A MongoDB connection string.
- For Atlas: a database user and your current public IP address
  added to the project's IP Access List.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/dsunmibola-png/TaskDuty.git
cd TaskDuty
```

The Stage 3 implementation is on `feature/task-search` until it
is merged into `main`. Before that merge, switch to it:

```bash
git switch feature/task-search
```

### 2. Configure and start the backend

From the repository root:

```bash
cd server
npm install
cp .env.example .env
```

The copy command is for first-time setup. If you already have
a configured `.env`, keep your existing file.

Update the MongoDB connection setting in `.env` using the
variable name provided in `.env.example`.

Generate a JWT secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `JWT_SECRET` in `.env`.

`DNS_SERVERS` is optional. Remove it to use your system's default
DNS resolver.

Keep `.env` private and do not commit it.

Start the API:

```bash
npm run dev
```

The default API address is:

```text
http://localhost:5001
```

Check that it is running by opening:

```text
http://localhost:5001/api/health
```

Keep this terminal running.

### 3. Start the frontend

Open a second terminal in the repository root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite.

The Vite development proxy forwards `/api` requests to
`http://localhost:5001`.

If you change the backend port, update the proxy target in
`client/vite.config.ts` and restart Vite.

### 4. Use the application

- Register an account or log in with an existing account.
- Open My Tasks.
- Create a task or view tasks already saved to your account.
- Search by a word in a task's title or description.
- Apply category and completion-status filters as needed.

New accounts start with an empty task list.

Tasks from the original localStorage-based frontend are not
automatically imported into MongoDB.

## Build and Lint

From the repository root, build the frontend:

```bash
npm --prefix client run build
```

Run the frontend linter:

```bash
npm --prefix client run lint
```

Build the backend:

```bash
npm --prefix server run build
```

To run the compiled backend, use a terminal inside `server`:

```bash
npm start
```

Stop the backend development server first so both processes
do not try to use the same port.

A successful frontend build checks compilation and produces
static assets. It does not configure production API hosting.

## How It Works

### Authentication

Registration and login return a JWT.

The frontend keeps the token in sessionStorage and sends it
in the Authorization header:

```text
Authorization: Bearer <token>
```

The backend verifies the token and checks that the user exists.
Task queries are restricted to that authenticated user's ID.

Logging out clears the frontend session.

### Task Management

Tasks are stored in MongoDB.

The frontend API helper maps MongoDB's `_id` field to the `id`
field used by the React components.

Create and edit forms wait for a successful API response before
navigating back to the task list. Failed requests display an error.

### Search and Filtering

The search input waits 300 ms before requesting results.
Outdated requests are cancelled when the search changes.

Example request:

```text
GET /api/tasks?search=React
```

The backend searches titles and descriptions without case
sensitivity. Special regex characters are escaped so the search
text is treated literally.

Searches are limited to the logged-in user's tasks.

The frontend applies category and completion-status filters to
the returned results. The API also supports those filters directly.

Example combined API query:

```text
GET /api/tasks?search=React&category=Work&completed=false
```

Clearing the search restores the loaded task list.
Clear filters resets the search, category, and completion status.

## API Endpoints

| Method | Endpoint | Authentication |
|---|---|---|
| GET | `/api/health` | None |
| POST | `/api/auth/register` | None |
| POST | `/api/auth/login` | None |
| POST | `/api/tasks` | Bearer token |
| GET | `/api/tasks` | Bearer token |
| GET | `/api/tasks/:id` | Bearer token |
| PATCH | `/api/tasks/:id` | Bearer token |
| DELETE | `/api/tasks/:id` | Bearer token |

Registration accepts `name`, `email`, and `password`.

Login accepts `email` and `password`.

Create-task requests require:

- `title`
- `description`
- `dueDate`
- `category`

`completed` is optional and defaults to `false`.

Dates use `YYYY-MM-DD`.

Categories are `Work`, `Personal`, `Urgent`, and `Important`.

Task-list query parameters:

| Parameter | Accepted value |
|---|---|
| `search` | Text, up to 200 characters after trimming |
| `category` | Work, Personal, Urgent, or Important |
| `completed` | `true` or `false` |

For Postman requests, select Authorization → Bearer Token
and paste the token returned by registration or login.

Requests for another user's task return 404.
Requests without authentication return 401.

## Verification

### Stage 2 Manual Tests Previously Completed

- Registration and login.
- Task creation, listing, updating, and deletion.
- Combined category and completion filtering.
- An empty task list for a second account with no tasks.
- A second account cannot read, edit, or delete another user's task.
- Requests without a token receive 401 Unauthorized.

### Stage 3 Checks Completed

- Frontend production build passed.
- Login through the frontend worked.
- Backend tasks appeared in the frontend.
- Matching searches returned the expected task.
- Uppercase searches returned the same matching task.
- A nonmatching search displayed an empty result.
- Clearing the search restored the task list.

### Additional Manual Checks

- Create, edit, complete, and delete a task through the frontend.
- Refresh after changes to confirm persistence.
- Combine search with category and completion-status filters.
- Test a word that appears only in a task's description.
- Check error handling when the backend is unavailable.

## Stage 3 Git Workflow

The search feature was implemented on:

```text
feature/task-search
```

A pull request was opened to merge this branch into `main`.

The submission recording demonstrates the application,
explains the search implementation, and shows the live merge
of the feature branch into `main`.

## Known Limitations

- Original browser-only tasks are not automatically migrated
  to MongoDB.
- The frontend session uses sessionStorage and normally ends
  when the browser tab is closed.
- Expired access tokens require the user to log out and log in again.
- Password reset and refresh-token endpoints are not implemented.
- An overdue task must receive a current or future due date
  before edits can be saved through the task form.
- The profile avatar is decorative.
- The documented setup is for local development. Production
  hosting requires API routing and frontend route-fallback
  configuration; the Vite development proxy is not a production
  deployment configuration.

## Author

Dawodu Sunmibola