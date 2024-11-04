import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic, tone, type, temperature } = await request.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: temperature || 0.7,
      messages: [
        {
          role: "system",
          content: `You are a comedy writer specializing in different styles of jokes. Create jokes based on these criteria:

          Dad Jokes:
          - Clean and family-friendly
          - Heavy use of puns or word play
          - Should make people groan and smile
          - Obvious or predictable punchlines
          
          Sarcastic Jokes:
          - Use irony to mock or criticize
          - Say the opposite of what is meant
          - Employ dry wit or deadpan delivery
          - Include subtle social commentary
          
          Dark Humor:
          - Address taboo or serious subjects
          - Make light of traditionally sensitive topics
          - Balance discomfort with amusement
          - Use gallows humor appropriately
          
          Generate a single ${tone} ${type} joke about ${topic}. Only return the joke text with no additional explanation or commentary.`
        },
        {
          role: "user",
          content: `Create a ${tone} ${type} joke about ${topic}. Remember to only return the joke text.`
        }
      ],
      max_tokens: 200,
    });

    return NextResponse.json({ joke: response.choices[0].message.content });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}