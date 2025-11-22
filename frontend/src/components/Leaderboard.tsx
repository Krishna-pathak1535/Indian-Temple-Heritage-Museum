import React, { useState, useEffect } from 'react';
import { gamificationAPI } from '../services/api';
import { HighScore } from '../types';
import './Leaderboard.css';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [selectedGameMode, setSelectedGameMode] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameModes = [
    { value: 'all', label: '🏆 All Games' },
    { value: 'temples-easy', label: '🏛️ Temples (Easy)' },
    { value: 'temples-medium', label: '🏛️ Temples (Medium)' },
    { value: 'temples-hard', label: '🏛️ Temples (Hard)' },
    { value: 'weapons-easy', label: '⚔️ Weapons (Easy)' },
    { value: 'weapons-medium', label: '⚔️ Weapons (Medium)' },
    { value: 'weapons-hard', label: '⚔️ Weapons (Hard)' },
    { value: 'fossils-easy', label: '🦴 Fossils (Easy)' },
    { value: 'fossils-medium', label: '🦴 Fossils (Medium)' },
    { value: 'fossils-hard', label: '🦴 Fossils (Hard)' },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const gameMode = selectedGameMode === 'all' ? undefined : selectedGameMode;
        const data = await gamificationAPI.getLeaderboard(gameMode, 50);
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGameMode]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getRankBadge = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreColor = (rank: number): string => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#333';
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p className="subtitle">Top performers in Museum Quiz Challenge</p>
      </div>

      <div className="filter-section">
        <h2>Filter by Game Mode</h2>
        <div className="filter-buttons">
          {gameModes.map(mode => (
            <button
              key={mode.value}
              className={`filter-btn ${selectedGameMode === mode.value ? 'active' : ''}`}
              onClick={() => setSelectedGameMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : (
        <div className="leaderboard-content">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="leaderboard-table">
              <div className="table-header">
                <div className="col-rank">Rank</div>
                <div className="col-user">User ID</div>
                <div className="col-score">Score</div>
                <div className="col-mode">Game Mode</div>
                <div className="col-date">Date</div>
              </div>

              <div className="table-body">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={`${entry.user_id}-${entry.achieved_at}`}
                    className={`table-row ${index === 0 ? 'first-place' : index === 1 ? 'second-place' : index === 2 ? 'third-place' : ''}`}
                  >
                    <div className="col-rank" style={{ color: getScoreColor(index + 1) }}>
                      {getRankBadge(index + 1)}
                    </div>
                    <div className="col-user">
                      <span className="user-id">User #{entry.user_id}</span>
                    </div>
                    <div className="col-score">
                      <span className="score-value">{entry.score}</span>
                    </div>
                    <div className="col-mode">
                      <span className="game-mode">{entry.game_mode}</span>
                    </div>
                    <div className="col-date">
                      <span className="date">{formatDate(entry.achieved_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="leaderboard-info">
            <p>Showing {leaderboard.length} top scores</p>
          </div>
        </div>
      )}
    </div>
  );
};
