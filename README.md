# r

Backend API for r

## Tech Stack

- **Frontend**: React
- **Backend**: FastAPI + SQLAlchemy
- **Frontend Source**: GitHub ([Repository](https://github.com/HimaShankarReddyEguturi/Designpythonworldclockui.git))

## Project Structure

```
r/
├── frontend/          # Frontend application
├── backend/           # Backend API
├── README.md          # This file
└── docker-compose.yml # Docker configuration (if applicable)
```

## Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for Python backends)
- Docker (optional, for containerized setup)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
# Follow backend-specific setup instructions in backend/README.md
```

## Features

- User authentication and authorization
- Resource creation and management
- Resource searching and filtering
- Notification system

## API Endpoints

- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Log in to an existing user account.
- `GET /api/profile` - Retrieve the current user's profile information.
- `PUT /api/profile` - Update the current user's profile information.
- `POST /api/resources` - Create a new resource (e.g. post, comment).
- `GET /api/resources` - Retrieve a list of resources (e.g. posts, comments).
- `GET /api/resources/{id}` - Retrieve a single resource by ID.
- `PUT /api/resources/{id}` - Update a single resource by ID.
- `DELETE /api/resources/{id}` - Delete a single resource by ID.

## License

MIT
