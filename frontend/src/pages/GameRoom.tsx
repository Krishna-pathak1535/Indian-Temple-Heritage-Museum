import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamificationAPI, userAPI } from '../services/api';
import { HighScore } from '../types';
import { GameRoomScene } from '../scenes/GameRoomScene';
import './GameRoom.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  category: string;
  difficulty: string;
  image_url?: string; // Optional image for visual questions
  explanation?: string; // Optional explanation after answer
}

export const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load game questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/questions.json');
        if (!response.ok) throw new Error('Failed to load questions');
        const allQuestions: Question[] = await response.json();
        setQuestions(allQuestions);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load game questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);

  // Track visit to game room
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await userAPI.trackVisit('game');
      } catch (err) {
        console.error('Error tracking visit:', err);
      }
    };
    
    trackVisit();
  }, []);

  const startGame = () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    // Filter questions by category and difficulty
    const filtered = questions.filter(
      q => q.category.toLowerCase() === selectedCategory.toLowerCase() &&
           q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
    );

    if (filtered.length === 0) {
      setError(`No questions found for ${selectedCategory} - ${selectedDifficulty}`);
      return;
    }

    // Shuffle questions and take first 10
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameState('playing');
    setError(null);
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (index === currentQuestion.correct_answer) {
      setScore(score + 10);
    }
    
    setAnswered(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    // Submit score to leaderboard
    try {
      const gameModeString = `${selectedCategory}-${selectedDifficulty}`;
      await gamificationAPI.submitScore(score, gameModeString);
    } catch (err) {
      console.error('Error submitting score:', err);
    }
    
    setGameState('result');
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedCategory('');
    setSelectedDifficulty('easy');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setError(null);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="game-room">
        <div className="loading">
          <h2>Loading Game...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-room">
      {/* 3D Background Scene */}
      <GameRoomScene />
      
      {/* Game Menu */}
      {gameState === 'menu' && (
        <div className="game-menu">
          <h1>🎮 Museum Quiz Challenge</h1>
          <p className="subtitle">Test your knowledge about Indian temples, weapons, and fossils!</p>

          {error && <div className="error-message">{error}</div>}

          <div className="menu-section">
            <h2>Select Category</h2>
            <div className="category-buttons">
              <button
                className={`category-btn ${selectedCategory === 'temples' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('temples')}
              >
                🏛️ Temples
              </button>
              <button
                className={`category-btn ${selectedCategory === 'weapons' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('weapons')}
              >
                ⚔️ Weapons
              </button>
              <button
                className={`category-btn ${selectedCategory === 'fossils' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('fossils')}
              >
                🦴 Fossils
              </button>
            </div>
          </div>

          <div className="menu-section">
            <h2>Select Difficulty</h2>
            <div className="difficulty-buttons">
              <button
                className={`difficulty-btn ${selectedDifficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('easy')}
              >
                Easy
              </button>
              <button
                className={`difficulty-btn ${selectedDifficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('medium')}
              >
                Medium
              </button>
              <button
                className={`difficulty-btn ${selectedDifficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty('hard')}
              >
                Hard
              </button>
            </div>
          </div>

          <div className="menu-actions">
            <button className="btn btn-primary" onClick={startGame}>
              Start Quiz
            </button>
            <button className="btn btn-secondary" onClick={goToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Game Playing */}
      {gameState === 'playing' && questions.length > 0 && (
        <div className="game-playing">
          <div className="game-header">
            <div className="progress">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="score">
              Score: <strong>{score}</strong>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="question-container">
            <h2 className="question">{questions[currentQuestionIndex].question}</h2>
            
            {/* Visual Question Support */}
            {questions[currentQuestionIndex].image_url && (
              <div className="question-image">
                <img 
                  src={questions[currentQuestionIndex].image_url} 
                  alt="Question visual"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => {
                let buttonClass = 'option-btn';
                
                if (answered) {
                  if (index === questions[currentQuestionIndex].correct_answer) {
                    buttonClass += ' correct';
                  } else if (index === selectedAnswer && selectedAnswer !== questions[currentQuestionIndex].correct_answer) {
                    buttonClass += ' incorrect';
                  }
                }
                
                if (selectedAnswer === index && !answered) {
                  buttonClass += ' selected';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="answer-feedback">
                {selectedAnswer === questions[currentQuestionIndex].correct_answer ? (
                  <p className="feedback correct">✓ Correct! +10 points</p>
                ) : (
                  <p className="feedback incorrect">✗ Incorrect. The correct answer was option {String.fromCharCode(65 + questions[currentQuestionIndex].correct_answer)}</p>
                )}
              </div>
            )}
          </div>

          {answered && (
            <div className="game-actions">
              <button className="btn btn-primary" onClick={nextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game Result */}
      {gameState === 'result' && (
        <div className="game-result">
          <h1>🎯 Quiz Complete!</h1>
          
          <div className="result-card">
            <div className="final-score">
              <span className="score-label">Your Score</span>
              <span className="score-value">{score}</span>
              <span className="score-max">/ {questions.length * 10}</span>
            </div>

            <div className="performance-stats">
              <div className="stat">
                <span className="stat-label">Percentage</span>
                <span className="stat-value">{Math.round((score / (questions.length * 10)) * 100)}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Category</span>
                <span className="stat-value">{selectedCategory.toUpperCase()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty</span>
                <span className="stat-value">{selectedDifficulty.toUpperCase()}</span>
              </div>
            </div>

            <div className="performance-message">
              {((score / (questions.length * 10)) * 100) >= 80 && (
                <p>🌟 Excellent! You're a true museum expert!</p>
              )}
              {((score / (questions.length * 10)) * 100) >= 60 && ((score / (questions.length * 10)) * 100) < 80 && (
                <p>👏 Great job! You know your stuff!</p>
              )}
              {((score / (questions.length * 10)) * 100) >= 40 && ((score / (questions.length * 10)) * 100) < 60 && (
                <p>📚 Good try! Learn more and try again!</p>
              )}
              {((score / (questions.length * 10)) * 100) < 40 && (
                <p>💪 Keep learning! You can do better!</p>
              )}
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={resetGame}>
              Play Again
            </button>
            <button className="btn btn-secondary" onClick={goToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
