# TaskDuty — Personal Task Manager

A responsive task manager built for the Techstudio Internship
Program, Online Stage 1. The interface follows the supplied
Figma design, with additional task-management features.

## Features

- Create, view, edit, and delete tasks.
- Mark tasks as completed or incomplete.
- Filter by category and completion status together.
- Required-field validation, including whitespace-only text.
- Due-date validation that prevents submitting past dates.
- Browser storage to keep tasks after refreshing.
- Responsive layouts for desktop and mobile.

## Tech Stack

- React and TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Project Structure

- `client/` — frontend application.
- `server/` — reserved for backend work; no backend implemented.

## Local Setup

Install Node.js 22.12 or newer and npm.

From the repository's root folder, run:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed in the terminal.

No environment variables or backend server are required.

## Build and Lint

Run these commands inside `client`:

```bash
npm run build
npm run lint
```

To preview the production build locally:

```bash
npm run preview
```

## How It Works

React state holds the task list. A useEffect saves changes to
localStorage. The same task form handles creating and editing
tasks, while category and status filters work together.

## Limitations

- Tasks are stored only in the current browser and origin;
  they do not sync across devices.
- Clearing browser storage removes saved tasks.
- An overdue task must receive a valid current or future due
  date before edits can be saved.
- The profile avatar is decorative; authentication is not included.

## Author

Dawodu Sunmibola



## Stage 2 — Backend API

The backend uses Node.js, Express, TypeScript, MongoDB, Mongoose,
bcryptjs, and JSON Web Tokens.

Stage 2 is tested using Postman. The Stage 1 frontend still uses
localStorage and is not connected to this API.

### Backend Features

- Register and log in.
- Store hashed passwords.
- Issue access tokens that expire after one hour.
- Create, read, update, and delete tasks.
- Restrict every task operation to its owner.
- Filter tasks by category and completion status together.
- Validate task fields and reject past due dates when supplied.
- Return JSON error responses.

### Backend Setup

From the repository root:

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` with your MongoDB connection string.

For MongoDB Atlas, create a database user and allow your current
public IP address in the project's IP Access List.

Generate a JWT secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `JWT_SECRET` in `.env`.

`DNS_SERVERS` is optional. Remove it to use your system's default
DNS resolver.

Start the API:

```bash
npm run dev
```

Default API address: `http://localhost:5001`

Check the build:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

Stop the development server before starting the compiled app,
so both do not try to use the same port.

### API Endpoints

| Method | Endpoint | Authentication |
|---|---|---|
| GET | /api/health | None |
| POST | /api/auth/register | None |
| POST | /api/auth/login | None |
| POST | /api/tasks | Bearer token |
| GET | /api/tasks | Bearer token |
| GET | /api/tasks/:id | Bearer token |
| PATCH | /api/tasks/:id | Bearer token |
| DELETE | /api/tasks/:id | Bearer token |

Registration accepts `name`, `email`, and `password`.
Login accepts `email` and `password`.

In Postman, select Authorization → Bearer Token and paste the
token returned by registration or login.

Create-task requests require `title`, `description`, `dueDate`,
and `category`. `completed` is optional and defaults to false.

Dates use `YYYY-MM-DD`. Categories are Work, Personal, Urgent,
and Important.

Example combined filter:

```text
GET /api/tasks?category=Work&completed=true
```

The API determines task ownership from the verified token.
Requests cannot assign or change a task's owner.

### Manual Tests Completed

- Registration and login.
- Task creation, listing, updating, and deletion.
- Combined category and completion filtering.
- A second account receives an empty list when it has no tasks.
- A second account cannot read, edit, or delete another user's task.
- The original task remains unchanged after unauthorized attempts.
- Requests without a token receive 401 Unauthorized.

Requests for another user's task return 404 to avoid revealing
whether that task exists.

### Backend Limitations

- No frontend integration for Stage 2.
- No password reset or refresh-token endpoint.
- Users must log in again when their access token expires.