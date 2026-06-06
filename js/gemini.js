/**
 * StressLess Student AI - Gemini Service
 * Real integration with Google Gemini 1.5 Flash API.
 * Includes fallback responses for offline/no-key scenarios.
 */
const GeminiService = (() => {
  const MODEL    = 'gemini-1.5-flash';
  const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

  const SYSTEM_PROMPT = `You are StressLess AI — a compassionate, professional mental wellness coach for Indian students preparing for competitive exams (NEET, JEE, CUET, CAT, GATE, UPSC, board exams).

Your role:
- Provide empathetic, evidence-based emotional support
- Offer practical stress management techniques  
- Give study-life balance guidance
- Help with exam anxiety and burnout prevention
- Detect signs of crisis and respond with appropriate care

Guidelines:
- Always be warm, supportive, and non-judgmental
- Validate feelings first, then guide
- Be specific and actionable (not generic platitudes)
- If severe distress detected, mention iCall: 9152987821 and Vandrevala: 1860-2662-345
- Keep responses 150-250 words unless asked for detail
- Use bullet points for lists; end with an encouraging note
- Occasionally mix a Hindi phrase naturally (e.g., "Tum kar sakte ho!")`;

  // Fallback responses when API unavailable
  const FALLBACKS = {
    coaching: [
      "Take a 5-minute breathing break right now — inhale 4s, hold 7s, exhale 8s. This directly calms your nervous system.\n\nRemember: every expert was once exactly where you are. Your consistency matters more than any single day's performance. 💙",
      "What you're feeling is completely valid. Exam pressure is real. Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This anchors you to the present moment. 🌟",
      "Burnout is your body asking for recovery, not weakness. Even 30 minutes of true rest can restore significant focus. Take a short walk, listen to music, or simply close your eyes. Progress > Perfection. 💪"
    ],
    triggers: "Your stress triggers are common among high-achieving students — you're not alone in this.\n\n• **Exam pressure**: Break syllabus into daily micro-goals; celebrate small wins\n• **Time management**: Try time-blocking — assign topics to specific hours\n• **Family expectations**: Have an honest conversation about your study plan\n• **Mock scores**: Treat each mock as data, not judgment\n\nFocus on one trigger at a time. You've got this! 💙",
    plan: "Here's a general 7-day wellness framework:\n\n**Daily Structure:**\n- Study in 45-min Pomodoro blocks with 10-min breaks\n- Morning: 10 min mindfulness before studying\n- Evening: 20 min light walk or stretching\n\n**Sleep:** 7-8 hours non-negotiable\n**Hydration:** 8 glasses of water daily\n**Weekly:** 1 guilt-free rest hour\n\nTrack one small win daily — momentum builds naturally! 🌟",
    summary: "Keep building your tracking habit — each entry gives you more self-awareness. Review your mood patterns and journal entries to understand what helps you most. Every day you show up is a win! 💙",
    crisis: "I hear you — what you're feeling is real and valid. You don't have to face this alone.\n\nRight now, let's take three slow breaths together. Then please try the Calm Mode button for guided exercises.\n\nImmediate support (India):\n📞 iCall: 9152987821 (Mon-Sat, 8AM-10PM)\n📞 Vandrevala Foundation: 1860-2662-345 (24/7)\n\nYour worth is not defined by any exam score. 💙"
  };

  function hasKey() {
    try {
      return (
        typeof GEMINI_API_KEY !== 'undefined' &&
        GEMINI_API_KEY &&
        GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
      );
    } catch (e) { return false; }
  }

  async function callAPI(userPrompt, systemContext = '') {
    if (!hasKey()) return null;

    const url = `${API_BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const fullPrompt = [
      SYSTEM_PROMPT,
      systemContext ? `Context: ${systemContext}` : '',
      `Student message: ${userPrompt}`
    ].filter(Boolean).join('\n\n');

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.85,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 700
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',      threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',threshold: 'BLOCK_ONLY_HIGH' }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response');
    return text;
  }

  async function getWellnessCoaching(message, context = {}) {
    const contextStr = [
      context.exam   ? `Exam: ${context.exam}` : '',
      context.mood   ? `Current mood: ${context.mood}` : '',
      context.triggers ? `Stress triggers: ${context.triggers}` : ''
    ].filter(Boolean).join(', ');

    try {
      const result = await callAPI(message, contextStr);
      return result !== null ? result : FALLBACKS.coaching[Math.floor(Math.random() * FALLBACKS.coaching.length)];
    } catch (e) {
      console.warn('Gemini coaching error:', e.message);
      return FALLBACKS.coaching[Math.floor(Math.random() * FALLBACKS.coaching.length)];
    }
  }

  async function analyzeTriggers(triggers = [], examType = '') {
    const prompt = `I'm preparing for ${examType || 'competitive exams'} and my current stress triggers are: ${triggers.join(', ')}. Please analyze these triggers and give me specific, actionable coping strategies for each one.`;
    try {
      const result = await callAPI(prompt);
      return result !== null ? result : FALLBACKS.triggers;
    } catch (e) {
      console.warn('Gemini triggers error:', e.message);
      return FALLBACKS.triggers;
    }
  }

  async function generatePlan(details = {}) {
    const { examType, daysRemaining, stressLevel, studyHours, sleepHours } = details;
    const prompt = `Create a personalized 7-day wellness and study plan for a student preparing for ${examType || 'competitive exam'}.
Details:
- Days until exam: ${daysRemaining || 30}
- Current stress level: ${stressLevel || 5}/10
- Daily study hours available: ${studyHours || 6}
- Current sleep hours: ${sleepHours || 7}

Please include: daily schedule with Pomodoro blocks, break activities, sleep tips, stress reduction techniques specific to their exam, morning/evening routines, and weekly milestones.`;

    try {
      const result = await callAPI(prompt);
      return result !== null ? result : FALLBACKS.plan;
    } catch (e) {
      console.warn('Gemini plan error:', e.message);
      return FALLBACKS.plan;
    }
  }

  async function weeklySummary(data = {}) {
    const prompt = `Generate a compassionate weekly wellness summary for a student:
- Average mood: ${data.avgMood || 'not tracked'}/5
- Mood logs this week: ${data.moodCount || 0}
- Average wellness score: ${data.avgScore || 'not calculated'}/100
- Journal entries: ${data.journalCount || 0}
- Days actively tracked: ${data.trackedDays || 0}/7

Highlight positive patterns, identify one concern if any, and suggest 3 specific improvements for next week. Keep it warm and encouraging.`;

    try {
      const result = await callAPI(prompt);
      return result !== null ? result : FALLBACKS.summary;
    } catch (e) {
      console.warn('Gemini summary error:', e.message);
      return FALLBACKS.summary;
    }
  }

  async function handleCrisis(message) {
    const prompt = `A student is experiencing severe exam-related distress. Their message: "${message.slice(0, 300)}". Respond with immediate compassionate support, grounding techniques, and include Indian crisis helplines (iCall: 9152987821, Vandrevala: 1860-2662-345). Keep response warm, actionable, and non-judgmental.`;
    try {
      const result = await callAPI(prompt);
      return result !== null ? result : FALLBACKS.crisis;
    } catch (e) {
      return FALLBACKS.crisis;
    }
  }

  return { getWellnessCoaching, analyzeTriggers, generatePlan, weeklySummary, handleCrisis, hasKey };
})();
