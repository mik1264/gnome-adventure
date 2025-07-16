const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const config = require('./config');

const app = express();
const port = config.server.port;

// Middleware
app.use(cors(config.server.cors));
app.use(express.json());

// Database connection
const pool = new Pool(config.database);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// API Routes

// Get leaderboard (top 10 scores)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM leaderboard ORDER BY score DESC, created_at DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit new score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const {
      player_name,
      score,
      field_size,
      flowers_collected,
      total_flowers,
      bombs_hit,
      time_taken,
      final_health,
      won
    } = req.body;

    // Validate required fields
    if (!player_name || score === undefined || !field_size || 
        flowers_collected === undefined || total_flowers === undefined ||
        bombs_hit === undefined || time_taken === undefined ||
        final_health === undefined || won === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert new score
    const result = await pool.query(
      `INSERT INTO leaderboard (
        player_name, score, field_size, flowers_collected, total_flowers,
        bombs_hit, time_taken, final_health, won
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [player_name, score, field_size, flowers_collected, total_flowers,
       bombs_hit, time_taken, final_health, won]
    );

    const newEntry = result.rows[0];

    // Get the rank of the new entry
    const rankResult = await pool.query(
      'SELECT COUNT(*) + 1 as rank FROM leaderboard WHERE score > $1 OR (score = $1 AND created_at < $2)',
      [newEntry.score, newEntry.created_at]
    );

    const rank = rankResult.rows[0].rank;

    res.status(201).json({
      entry: newEntry,
      rank: rank
    });
  } catch (err) {
    console.error('Error submitting score:', err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get player's personal best
app.get('/api/leaderboard/player/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    const result = await pool.query(
      'SELECT * FROM leaderboard WHERE player_name = $1 ORDER BY score DESC LIMIT 1',
      [playerName]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching player best:', err);
    res.status(500).json({ error: 'Failed to fetch player best' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Gnome Adventure API server running on port ${port}`);
});

module.exports = app; 