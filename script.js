function lab() {
  return {
    step: 1,
    maxStep: 1,
    selectedType: null,
    stepLabels: ['Choose Output', 'Set Context', 'Get Interviewed', 'Get Deliverable'],

    get isAgent() {
      return this.selectedType === 'researcher' || this.selectedType === 'analyst';
    },

    get agentName() {
      return this.selectedType === 'researcher' ? 'Researcher' : 'Analyst';
    },

    cards: [
      {
        type: 'doc', number: '01', title: 'Strategic Document',
        desc: 'A Word-ready brief, proposal, or strategy plan with executive summary and recommendations.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2001A" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      },
      {
        type: 'data', number: '02', title: 'Data-Backed Analysis',
        desc: 'An Excel-ready analysis with metrics, key findings, and structured data to support decisions.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2001A" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      },
      {
        type: 'deck', number: '03', title: 'Presentation',
        desc: 'A PowerPoint-ready deck with slide content, talking points, and a clear narrative arc.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2001A" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
      },
      {
        type: 'comms', number: '04', title: 'Stakeholder Communication',
        desc: 'A polished email or memo for a change initiative, team update, or executive briefing.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2001A" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      },
      {
        type: 'researcher', number: '05', title: 'Deep Research Report',
        desc: 'Multi-source research on any topic — market trends, competitive landscape, or strategic context. With citations.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        iconBg: '#F5F3FF',
        agentTag: 'Researcher agent',
      },
      {
        type: 'analyst', number: '06', title: 'Data Analysis',
        desc: 'Upload your Excel or CSV and get visual analysis — charts, key insights, and recommendations from your own data.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
        iconBg: '#F5F3FF',
        agentTag: 'Analyst agent',
      },
    ],

    contextPrompts: {
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

Please review the data I've attached and ask me any clarifying questions before you begin the analysis.`,
    },

    generatePrompts: {
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

Make it clear and visual. Write for a senior leadership audience who want insight, not raw numbers.`,
    },

    goTo(s) {
      this.step = s;
      if (s > this.maxStep) this.maxStep = s;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    copy(el, event) {
      const text = el.textContent;
      const btn = event.currentTarget;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
        }, 2000);
      });
    },
  };
}
