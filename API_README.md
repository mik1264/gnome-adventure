# Gnome Adventure API

Backend API for the Interactive Gnome Adventure game leaderboard system using Neon PostgreSQL database.

## Features

- **Global Leaderboard**: Cloud-based leaderboard with top 10 scores
- **Score Submission**: Submit player scores with detailed game statistics
- **Player Rankings**: Real-time ranking system
- **Fallback Support**: Graceful fallback to local storage if API is unavailable
- **CORS Enabled**: Cross-origin requests supported for frontend integration

## Database Schema

The API uses a PostgreSQL database with the following table structure:

```sql
CREATE TABLE leaderboard (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    field_size INTEGER NOT NULL,
    flowers_collected INTEGER NOT NULL,
    total_flowers INTEGER NOT NULL,
    bombs_hit INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    final_health INTEGER NOT NULL,
    won BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET /api/leaderboard
Returns the top 10 scores from the leaderboard.

**Response:**
```json
[
  {
    "id": 1,
    "player_name": "Player1",
    "score": 1250,
    "field_size": 10,
    "flowers_collected": 5,
    "total_flowers": 5,
    "bombs_hit": 2,
    "time_taken": 45,
    "final_health": 2,
    "won": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/leaderboard
Submit a new score to the leaderboard.

**Request Body:**
```json
{
  "player_name": "Player1",
  "score": 1250,
  "field_size": 10,
  "flowers_collected": 5,
  "total_flowers": 5,
  "bombs_hit": 2,
  "time_taken": 45,
  "final_health": 2,
  "won": true
}
```

**Response:**
```json
{
  "entry": {
    "id": 1,
    "player_name": "Player1",
    "score": 1250,
    "field_size": 10,
    "flowers_collected": 5,
    "total_flowers": 5,
    "bombs_hit": 2,
    "time_taken": 45,
    "final_health": 2,
    "won": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "rank": 1
}
```

### GET /api/leaderboard/player/:playerName
Get a specific player's best score.

### GET /health
Health check endpoint.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```
DATABASE_URL=postgresql://neondb_owner:npg_Fimuh2wyV7PL@ep-floral-butterfly-afh31i6b-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
```

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Deployment Options

### Option 1: Heroku
1. Create a Heroku app
2. Add the DATABASE_URL environment variable
3. Deploy using Git

### Option 2: Railway
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Option 3: Vercel
1. Import your repository
2. Add environment variables
3. Deploy serverless functions

### Option 4: DigitalOcean App Platform
1. Create a new app
2. Connect repository
3. Add environment variables
4. Deploy

## Database Setup (Already Completed)

The Neon database is already set up with:
- **Project ID**: lingering-breeze-69443776
- **Database**: neondb
- **Table**: leaderboard (with proper indexes)

## Security Notes

- Database credentials are stored in environment variables
- CORS is configured to allow cross-origin requests
- Input validation is implemented for all endpoints
- SQL injection protection through parameterized queries

## Frontend Integration

The frontend game automatically detects if the API is available and falls back to local storage if needed. Update the `API_BASE_URL` in the game's JavaScript to point to your deployed API.

## Testing

Test the API endpoints using curl:

```bash
# Get leaderboard
curl https://your-api-url.com/api/leaderboard

# Submit score
curl -X POST https://your-api-url.com/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"player_name":"TestPlayer","score":1000,"field_size":8,"flowers_collected":3,"total_flowers":4,"bombs_hit":1,"time_taken":60,"final_health":2,"won":false}'
```

## Support

For any issues or questions, please check the logs and ensure:
1. Database connection is working
2. Environment variables are set correctly
3. CORS is properly configured
4. Frontend is pointing to the correct API URL 