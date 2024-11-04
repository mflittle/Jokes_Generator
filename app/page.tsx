'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

const topics = ['work', 'people', 'animals', 'food', 'television', 'weather'];
const tones = ['witty', 'sarcastic', 'silly', 'dark', 'goofy', 'dad'];
const jokeTypes = ['pun', 'knock-knock', 'story'];

export default function Home() {
  const [joke, setJoke] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [selectedTone, setSelectedTone] = useState(tones[0]);
  const [selectedType, setSelectedType] = useState(jokeTypes[0]);
  const [temperature, setTemperature] = useState(0.7);

  // Store the parameters used to generate the current joke
  const [currentJokeParams, setCurrentJokeParams] = useState({
    topic: topics[0],
    tone: tones[0],
    type: jokeTypes[0]
  });

  const generateJoke = async () => {
    setLoading(true);
    // Clear evaluation when generating new joke
    setEvaluation('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          tone: selectedTone,
          type: selectedType,
          temperature: temperature,
        }),
      });
      const data = await response.json();
      setJoke(data.joke);
      // Store the parameters used for this joke
      setCurrentJokeParams({
        topic: selectedTopic,
        tone: selectedTone,
        type: selectedType
      });
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
        body: JSON.stringify({
          joke,
          // Pass the parameters that were used to generate this joke
          ...currentJokeParams
        }),
      });
      const data = await response.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error:', error);
    }
    setEvaluating(false);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTemperature = parseFloat(e.target.value);
    setTemperature(newTemperature);
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">AI Joke Generator</h1>
      
      <div className="space-y-6">
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {jokeTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={handleTemperatureChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>
        </div>

        <button
          onClick={generateJoke}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Joke'}
        </button>

        {joke && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Generated Joke:</h2>
            <p className="text-lg">{joke}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Topic: {currentJokeParams.topic}</p>
              <p>Tone: {currentJokeParams.tone}</p>
              <p>Type: {currentJokeParams.type}</p>
            </div>
          </div>
        )}

        {joke && (
          <div className="space-y-4">
            <button
              onClick={evaluateJoke}
              disabled={evaluating}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
