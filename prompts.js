const contextPrompts = {
  doc: `I need to: [Describe your challenge — what you need to deliver, decide on, or improve in the coming weeks. Be specific.]

Help me produce a strategic document I can share with leadership — structured, actionable, ready to paste into Word. Let's have a discussion and you can interview me.`,
  data: `I need to: [Describe your challenge — where data and analysis would help you make a better decision. Be specific.]

Help me produce a data-backed analysis with metrics, key findings, and recommendations — structured so I can paste it into Excel. Let's have a discussion and you can interview me.`,
  deck: `I need to: [Describe your challenge — what you need to present to stakeholders, your team, or leadership. Be specific.]

Help me produce a compelling presentation — slide-by-slide content with talking points I can build in PowerPoint. Let's have a discussion and you can interview me.`,
  comms: `I need to: [Describe your situation — what you need to communicate, to whom, and why it matters.]

Help me draft a polished stakeholder communication — clear, professional, and ready to send. Let's have a discussion and you can interview me.`,
  researcher: `I need to research: [Describe the topic — e.g., competitive landscape, market trends, best practices, regulatory changes.]

This will feed into: [What decision or deliverable depends on this research?]

Let's have a discussion and you can interview me.`,
  analyst: `I need to analyse: [Describe the data you have and what you want to learn from it.]

This will inform: [What decision or presentation depends on this analysis?]

I've attached my data file. Let's have a discussion and you can interview me.`,
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

Make it clear and visual. Write for a senior leadership audience who want insight, not raw numbers.`,
};
