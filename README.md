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