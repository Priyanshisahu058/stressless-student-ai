/**
 * StressLess Student AI - Gemini Service Module
 * 
 * Handles all communication with the Google Gemini API.
 * API key is loaded from config.js (gitignored).
 * Includes fallback responses if the API is unavailable.
 */

const GeminiService = (() => {
  const MODEL = 'gemini-1.5-flash';
  const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

  // System prompt establishing AI wellness coach persona
  const SYSTEM_PROMPT = `You are StressLess AI — a compassionate, professional AI wellness coach for students preparing for high-pressure Indian competitive examinations (NEET, JEE, CUET, CAT, GATE, UPSC, and board exams).

Your role is to:
1. Provide empathetic, evidence-based emotional support
2. Offer practical stress management techniques
3. Give study-life balance guidance
4. Help with exam anxiety and burnout prevention
5. Provide positive, realistic motivation
6. Detect signs of crisis and respond with appropriate care

Guidelines:
- Always be warm, supportive, and non-judgmental
- Use simple, relatable language (English, mix Hindi phrases occasionally where natural)
- Never dismiss a student's feelings — validate first, then guide
- Provide actionable, specific advice (not generic platitudes)
- If you detect severe distress, gently suggest professional help alongside immediate coping techniques
- Keep responses concise (150-250 words) unless asked for detailed plans
- Format with bullet points for readability when giving lists
- End responses with a gentle, encouraging note`;

  /** Fallback responses when API is unavailable */
  const FALLBACKS = {
    wellness: [
      "I'm here for you! 💙 Remember: every expert was once a student struggling just like you. Take a 5-minute break, breathe deeply, and then continue. You're doing better than you think. Consider trying the 4-7-8 breathing technique in the Calm Mode section.",
      "Your feelings are completely valid. Exam stress is real and challenging. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you back to the present moment. 🌟",
      "Burnout is your body asking for rest, not a sign of weakness. Even 30 minutes of rest can restore your focus significantly. Try a short walk, listen to calming music, or simply close your eyes. Progress > Perfection! 💪"
    ],
    plan: "Unable to generate AI plan at the moment. Here's a general recommendation: Study in 45-minute Pomodoro sessions with 15-minute breaks. Sleep 7-8 hours daily. Drink 8 glasses of water. Practice 10 minutes of mindfulness each morning. Review difficult topics in your peak focus hours (morning for most people). Reach out to your support system whenever needed.",
    analysis: "Your stress triggers are understandable given the pressure of competitive exams. Try addressing one trigger at a time. For time management: use time-blocking. For exam pressure: break your syllabus into daily micro-goals. For family expectations: have an honest conversation about your study plan. You've got this! 💙",
    crisis: "I hear you — what you're feeling is real and valid. You don't have to face this alone. Right now, let's take three deep breaths together. Then, use the Calm Mode button for guided exercises. Remember: your worth is not defined by your exam score. Please also consider speaking to a trusted person — a friend, family member, or counselor. iCall helpline: 9152987821 💙"
  };

  /** Make a Gemini API request */
  async function callGemini(prompt, context = '') {
    let apiKey;
    try {
      apiKey = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : null;
    } catch (e) {
      apiKey = null;
    }

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('API_KEY_NOT_SET');
    }

    const url = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${context ? 'Context: ' + context + '\n\n' : ''}Student message: ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    return text;
  }

  /** Get wellness coaching response */
  async function getWellnessCoaching(userMessage, userData = {}) {
    const context = userData
      ? `Student profile: Exam: ${userData.exam || 'not specified'}, Current mood: ${userData.mood || 'not specified'}, Recent stress triggers: ${userData.triggers || 'none mentioned'}`
      : '';
    
    try {
      return await callGemini(userMessage, context);
    } catch (e) {
      if (e.message === 'API_KEY_NOT_SET') return null; // Signal to show key setup UI
      console.warn('Gemini unavailable, using fallback:', e.message);
      return FALLBACKS.wellness[Math.floor(Math.random() * FALLBACKS.wellness.length)];
    }
  }

  /** Analyze stress triggers */
  async function analyzeStressTriggers(triggers, examType = '') {
    const prompt = `I'm preparing for ${examType || 'competitive exams'} and my current stress triggers are: ${triggers.join(', ')}. Please analyze these triggers and give me specific, actionable coping strategies for each.`;
    try {
      return await callGemini(prompt);
    } catch (e) {
      return FALLBACKS.analysis;
    }
  }

  /** Generate personalized study wellness plan */
  async function generateWellnessPlan(planData) {
    const { examType, daysRemaining, stressLevel, studyHours, sleepHours } = planData;
    const prompt = `Create a personalized 7-day wellness plan for a student preparing for ${examType}. 
Details:
- Days until exam: ${daysRemaining}
- Current stress level: ${stressLevel}/10
- Available study hours per day: ${studyHours}
- Current sleep hours: ${sleepHours}

Please provide:
1. Daily study schedule with Pomodoro blocks
2. Break activities
3. Sleep optimization tips
4. Stress reduction techniques specific to their exam
5. Morning and evening wellness routines
6. Weekly wellness milestones`;
    
    try {
      return await callGemini(prompt);
    } catch (e) {
      return FALLBACKS.plan;
    }
  }

  /** Generate mood insights */
  async function getMoodInsights(moodHistory, journalEntry = '') {
    const moodSummary = moodHistory.slice(-7).map(m => m.mood).join(', ');
    const prompt = `Based on my mood over the past week: ${moodSummary || 'limited data available'}. ${journalEntry ? 'My latest journal entry: ' + journalEntry : ''} Please provide personalized insights about my emotional patterns and specific recommendations to improve my wellbeing.`;
    
    try {
      return await callGemini(prompt);
    } catch (e) {
      return FALLBACKS.wellness[0];
    }
  }

  /** Handle crisis/severe distress */
  async function handleCrisis(message) {
    const prompt = `A student is experiencing what seems like severe exam-related distress. Their message: "${message}". Please respond with immediate, compassionate support, grounding techniques, and gentle encouragement. Include crisis resource information (iCall: 9152987821, Vandrevala Foundation: 1860-2662-345). Keep response warm and actionable.`;
    
    try {
      return await callGemini(prompt);
    } catch (e) {
      return FALLBACKS.crisis;
    }
  }

  /** Generate weekly wellness summary */
  async function getWeeklySummary(weekData) {
    const prompt = `Generate a compassionate weekly wellness summary for a student based on: Average mood: ${weekData.avgMood}/5, Average wellness score: ${weekData.avgScore}/100, Journal entries written: ${weekData.journalCount}, Days with mood tracked: ${weekData.moodDays}/7. Highlight positive trends and suggest 3 specific improvements for next week.`;
    
    try {
      return await callGemini(prompt);
    } catch (e) {
      return 'Keep going! Each day you track your wellness is progress. Review your mood trends and journal entries to understand your patterns better. You\'re investing in yourself! 💙';
    }
  }

  return {
    getWellnessCoaching,
    analyzeStressTriggers,
    generateWellnessPlan,
    getMoodInsights,
    handleCrisis,
    getWeeklySummary
  };
})();
