// GeminiService: lightweight wrapper with safe fallback
const GeminiService = (() => {
  function hasKey(){
    try { return typeof GEMINI_API_KEY !== 'undefined' && GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'; }
    catch(e){ return false; }
  }

  async function getWellnessCoaching(message, context={}){
    if (!hasKey()) return null; // Signal App to show API prompt

    // NOTE: This is a simulated response placeholder for demo/hackathon use.
    // Replace this with an actual call to Gemini/LLM endpoint from a secure server.
    await new Promise(r=>setTimeout(r,600));
    const tips = [
      "Take a 10-minute focused break and practice 4-7-8 breathing.",
      "Break study tasks into 25-minute sprints and reward yourself after each.",
      "Write down one small achievable goal for today to reduce overwhelm."
    ];
    return `I hear you. ${tips[Math.floor(Math.random()*tips.length)]}\n\nIf things feel overwhelming, try Calm Mode or reach out to someone you trust.`;
  }

  async function analyzeTriggers(triggers=[], examType=''){
    if (!hasKey()) return null;
    await new Promise(r=>setTimeout(r,600));
    return `I see ${triggers.length} trigger(s). Common practical steps:\n- Acknowledge the feeling\n- Prioritize 1-2 actionable steps\n- Reframe negative self-talk\n\nExample: If deadlines are overwhelming, chunk tasks and set mini-deadlines.`;
  }

  async function generatePlan(details={}){
    if (!hasKey()) return null;
    await new Promise(r=>setTimeout(r,800));
    return `Personalized plan for ${details.examType || 'your exam'} (approx):\n- Daily focused study: ${Math.min(8, Math.max(2, Math.round(details.studyHours||4)))} hours\n- Microbreaks: 5-10 minutes every 50 minutes\n- Sleep target: ${Math.round(details.sleepHours||7)} hours\n- Weekly review: 2 hours\n\nInclude short mindfulness sessions after heavy study blocks.`;
  }

  async function weeklySummary(data){
    if (!hasKey()) return null;
    await new Promise(r=>setTimeout(r,500));
    return `This week you logged ${data.moodCount || 0} mood entries. Trend: try to keep consistent sleep & hydration.`;
  }

  return { getWellnessCoaching, analyzeTriggers, generatePlan, weeklySummary, hasKey };
})();
