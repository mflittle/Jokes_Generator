'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const [joke, setJoke] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const generateJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
      });
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const evaluateJoke = async () => {
    if (!joke) return;
    
    setEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joke }),
      });
      const data = await response.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error:', error);
    }
    setEvaluating(false);
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">AI Joke Generator</h1>
      
      <div className="space-y-6">
        <button
          onClick={generateJoke}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Generating...' : 'Generate Joke'}
        </button>

        {joke && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Generated Joke:</h2>
            <p className="text-lg">{joke}</p>
          </div>
        )}

        {joke && (
          <div className="space-y-4">
            <button
              onClick={evaluateJoke}
              disabled={evaluating}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {evaluating ? 'Evaluating...' : 'Evaluate Joke'}
            </button>

            {evaluation && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-bold mb-2">Evaluation:</h2>
                <p>{evaluation}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Analytics />
    </main>
  );
}
