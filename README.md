# Trae Todo

A modern, feature-rich todo application built with Next.js 14, featuring a clean UI and powerful task management capabilities.

## Features

- **GitHub Authentication**: Secure user authentication through GitHub
- **Priority-Based Task Management**: Organize tasks into four priority levels (Urgent, High, Normal, Low)
- **Drag and Drop**: Intuitive drag-and-drop interface for task reordering and priority changes
- **Subtasks Support**: Break down complex tasks into manageable subtasks
- **Due Dates**: Set and track task deadlines
- **Real-time Updates**: Instant UI updates when tasks are modified
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Color Coding**: Visual task organization with color indicators

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js with GitHub provider
- **State Management**: React Hooks and Server Actions
- **DnD**: Hello Pangea (maintained fork of react-beautiful-dnd)

## Getting Started

### Prerequisites

- Node.js 18+ 
- GitHub account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trae-todo.git
cd trae-todo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

### Database Management

- View database: `npx prisma studio`
- Update schema: `npx prisma migrate dev`
- Reset database: `npx prisma migrate reset`

### Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations

## License

MIT
