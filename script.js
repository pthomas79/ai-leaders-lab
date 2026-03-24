let currentStep = 1;
let selectedType = null;

const contextPrompts = {
  doc: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

My current challenge: [Describe a real operational challenge you're facing right now — something you need to deliver, decide on, or improve in the coming weeks. Be specific about the situation.]

I need to produce a strategic document that addresses this challenge — something I could share with my leadership team or stakeholders. Think of it as a Word document with clear structure and actionable recommendations.

Before you create anything, make sure you fully understand my situation.`,
  data: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

My current challenge: [Describe a real operational challenge you're facing right now — something where data and analysis would help you make a better decision. Be specific.]

I need to produce a structured, data-backed analysis that supports decision-making — something I could paste into Excel with metrics, key findings, and clear recommendations.

Before you create anything, make sure you fully understand my situation.`,
  deck: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

My current challenge: [Describe a real operational challenge you're facing right now — something you need to present to stakeholders, your team, or leadership. Be specific.]

I need to produce a compelling presentation — slide-by-slide content with talking points that I could build in PowerPoint. It should tell a clear story with a logical flow.

Before you create anything, make sure you fully understand my situation.`,
  comms: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

My current challenge: [Describe a real situation where you need to communicate something important — a change, an update, a decision, a new initiative. Who needs to hear it and why?]

I need to produce a polished stakeholder communication — an email or memo that's clear, professional, and drives the right action. It should be ready to send.

Before you create anything, make sure you fully understand my situation.`,

  researcher: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

I need to research the following topic: [Describe what you want to understand — e.g., "the competitive landscape for plant-based nutrition in Southeast Asia" or "best practices in supply chain resilience for FMCG companies" or "emerging AI regulations affecting consumer goods companies"].

My goal: [What decision or deliverable will this research feed into? e.g., "I'm building a business case for a new initiative" or "I need to present strategic options to my leadership team"].

Before you start researching, please ask me any clarifying questions you need to focus the research effectively.`,

  analyst: `I am [your name], [your title] at Nestlé, based in [your location]. I work in [your function — e.g., marketing, finance, supply chain, commercial].

I have attached a data file containing: [Describe what's in your file — e.g., "quarterly sales data by market and SKU" or "12 months of budget vs. actual costs by category" or "customer feedback survey results"].

My analysis goal: [What do you want to understand from this data? e.g., "I want to identify which markets are underperforming vs. target" or "I need to find the main drivers of cost overrun"].

What this will inform: [e.g., "I'm presenting to my VP next week on where to prioritise investment"].

Please review the data I've attached and ask me any clarifying questions before you begin the analysis.`
};

const generatePrompts = {
  doc: `Great — based on everything we've discussed, please create my strategic document now. Structure it as:

1. Executive Summary (2–3 paragraphs)
2. Situation Analysis (current state, key challenges)
3. Strategic Options (2–3 options with pros and cons for each)
4. Recommended Approach (your recommendation with rationale)
5. Implementation Roadmap (key actions, owners, timeline)
6. Next Steps (immediate actions for the next 2 weeks)

Write it in a professional tone suitable for senior leadership. Make it specific to my situation — no generic filler. Format it so I can paste it directly into a Word document.`,
  data: `Great — based on everything we've discussed, please create my analysis now. Structure it as:

1. Analysis Summary (key question we're answering, 2–3 sentences)
2. Key Metrics Dashboard (a table with the most important metrics, current values or estimates, and targets)
3. Data Breakdown (structured tables showing the analysis by relevant categories)
4. Key Findings (3–5 numbered insights from the data, with supporting figures)
5. Risk Factors (what could change these numbers)
6. Recommended Actions (what the data says we should do, prioritized)

Use tables wherever possible. Make the numbers realistic for my context — use estimates where exact data isn't available and flag them as such. Format it cleanly so I can copy it and paste it into an Excel spreadsheet.`,
  deck: `Great — based on everything we've discussed, please create my presentation now. Structure it as:

Slide 1: Title slide (compelling title + subtitle + my name)
Slide 2: The Challenge (what problem we're solving and why it matters now)
Slide 3: Current Situation (data points, context, what's happening today)
Slide 4–5: Our Approach (the strategy or solution, broken into clear pillars)
Slide 6: Evidence / Data (supporting metrics, benchmarks, or proof points)
Slide 7: Roadmap (timeline, key milestones, who owns what)
Slide 8: Next Steps & Ask (what we need from the audience, clear call to action)

For each slide, give me:
— The slide title
— 3–4 bullet points of content
— Speaker notes (what I should say in my own words)

Keep it concise. No slide should have more than 5 bullet points. Make it tell a story.`,
  comms: `Great — based on everything we've discussed, please draft my communication now. Structure it as:

Subject Line: [Clear, specific, action-oriented]

Opening: Why I'm writing and why it matters to the reader (2–3 sentences)

Context: The background they need — what happened, what's changing, what decision was made (1 short paragraph)

The Key Message: The core thing I need them to understand (clear and unambiguous)

What This Means For You: Specific impact on the reader and what changes for them

Action Needed: Exactly what I need from them, with a deadline if relevant

Closing: Supportive tone, offer to discuss, next touchpoint

Write it in a professional but human tone — not corporate boilerplate. It should feel like it came from a leader who respects their audience's time. Keep it under 400 words.`,

  researcher: `Based on our conversation, please produce a comprehensive research report. Structure it as:

1. Executive Summary (key findings in 3–4 sentences — write it so a busy executive can stop here)
2. Context & Background (why this topic matters right now, key forces at play)
3. Key Findings (5–7 numbered insights, each with supporting evidence or data points)
4. Landscape Overview (who's doing what — companies, markets, trends worth knowing)
5. Implications for My Context (what this means specifically for my situation at Nestlé)
6. Strategic Options (2–3 paths forward based on what the research shows)
7. Sources (list all references used with links where available)

Write it for a senior leader audience. Be specific — no generic observations. Prioritise insight over volume.`,

  analyst: `Based on our conversation and the data I've shared, please produce a full analysis report. Structure it as:

1. Analysis Summary (what question we answered and the one-line answer, in 2–3 sentences)
2. Key Metrics Overview (a table of the most important numbers — actuals, targets, variances)
3. Top Findings (5 numbered insights from the data, each with the specific number that supports it)
4. Visual Breakdown (charts or tables showing the most important patterns — by region, time period, category, or whatever is most relevant to my data)
5. What's Driving the Numbers (root cause analysis of the most significant trends or gaps)
6. Recommended Actions (3 specific things the data says I should do, in priority order)

Make it clear and visual. Write for a senior leadership audience who want insight, not raw numbers.`
};

function selectCard(card, type) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedType = type;
  document.getElementById('btn-step1').disabled = false;
}

function updateProgress(step) {
  for (let i = 1; i <= 4; i++) {
    const circle = document.getElementById('pc' + i);
    const label = document.getElementById('pl' + i);
    circle.classList.remove('active', 'done');
    label.classList.remove('active', 'done');
    if (i < step) {
      circle.classList.add('done');
      circle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      label.classList.add('done');
    } else if (i === step) {
      circle.classList.add('active');
      circle.textContent = i;
      label.classList.add('active');
    } else {
      circle.textContent = i;
    }
  }
  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById('line' + i);
    line.classList.toggle('done', i < step);
  }
}

var maxStepReached = 1;

function clickStep(step) {
  if (step <= maxStepReached) goToStep(step);
}

function updateStepNav() {
  for (let i = 1; i <= 4; i++) {
    var ps = document.getElementById('ps' + i);
    ps.classList.toggle('disabled', i > maxStepReached);
  }
}

function goToStep(step) {
  currentStep = step;
  if (step > maxStepReached) maxStepReached = step;
  updateStepNav();
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');
  updateProgress(Math.min(step, 4));

  if (step === 2 && selectedType) {
    document.getElementById('context-prompt').textContent = contextPrompts[selectedType];
    var isAgent = selectedType === 'researcher' || selectedType === 'analyst';
    var agentName = selectedType === 'researcher' ? 'Researcher' : 'Analyst';
    var warning = document.getElementById('agent-warning');
    warning.style.display = isAgent ? 'block' : 'none';
    if (isAgent) {
      document.getElementById('agent-name-in-warning').textContent = agentName;
      document.getElementById('open-copilot-title').textContent = 'Open the ' + agentName + ' agent';
      document.getElementById('open-copilot-desc').textContent = 'In Microsoft Teams or copilot.microsoft.com, look for the Agents section in the left sidebar. Select "' + agentName + '" to open a dedicated conversation with that agent. If you don\'t see it, check the disclaimer below.';
    } else {
      document.getElementById('open-copilot-title').textContent = 'Open Microsoft Copilot';
      document.getElementById('open-copilot-desc').textContent = 'Open Copilot in Microsoft Teams (look for the Copilot icon in the left sidebar), or go to copilot.microsoft.com in your browser. Use the same Copilot throughout — don\'t switch apps mid-conversation.';
    }
  }
  if (step === 4 && selectedType) {
    document.getElementById('generate-prompt').textContent = generatePrompts[selectedType];
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyPrompt(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const box = document.getElementById(id).closest('.prompt-box');
    const btn = box.querySelector('.copy-btn');
    btn.classList.add('copied');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
    }, 2000);
  });
}
