# FastAPI Backend

## Setup

1. Clone the repository: `git clone https://github.com/yourusername/yourrepo.git`
2. Install the dependencies: `pip install -r requirements.txt`
3. Run the application: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## API Endpoints

### Health Check

* `GET /api/health`: Returns the health status of the API

### User Authentication

* `POST /api/auth/login`: Authenticates a user and returns an access token
* `POST /api/auth/register`: Registers a new user and returns an access token

### User Management

* `GET /api/users`: Returns a list of all users
* `GET /api/users/{id}`: Returns a single user by ID

### Item Management

* `POST /api/items`: Creates a new item
* `GET /api/items`: Returns a list of all items
* `PUT /api/items/{id}`: Updates an item by ID
* `DELETE /api/items/{id}`: Deletes an item by ID

## Database

The application uses a SQLite database. You can change the database URL in the `app/config.py` file.

## Testing

The application includes a test suite in the `tests` directory. You can run the tests using the `pytest` command.
