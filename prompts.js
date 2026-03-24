const contextPrompts = {
  doc: `I need to: [Describe your challenge. What do you need to deliver, decide on, or improve in the coming weeks? Be specific.]

Help me produce a strategic document I can share with leadership. Structured, actionable, ready to paste into Word. Let's have a discussion and you can interview me, one question at a time.`,
  data: `I need to: [Describe your challenge. Where would data and analysis help you make a better decision? Be specific.]

Help me produce a data-backed analysis with metrics, key findings, and recommendations. Structured so I can paste it into Excel. Let's have a discussion and you can interview me, one question at a time.`,
  deck: `I need to: [Describe your challenge. What do you need to present to stakeholders, your team, or leadership? Be specific.]

Help me produce a compelling presentation. Slide-by-slide content with talking points I can build in PowerPoint. Let's have a discussion and you can interview me, one question at a time.`,
  comms: `I need to: [Describe your situation. What do you need to communicate, to whom, and why does it matter?]

Help me draft a polished stakeholder communication. Clear, professional, and ready to send. Let's have a discussion and you can interview me, one question at a time.`,
  researcher: `I need to research: [Describe the topic, e.g. competitive landscape, market trends, best practices, regulatory changes.]

This will feed into: [What decision or deliverable depends on this research?]

Let's have a discussion and you can interview me, one question at a time.`,
  analyst: `I need to analyse: [Describe the data you have and what you want to learn from it.]

This will inform: [What decision or presentation depends on this analysis?]

I've attached my data file. Let's have a discussion and you can interview me, one question at a time.`,
};

const generatePrompts = {
  doc: `Now create my strategic document as a Word file. Sections: Executive Summary, Situation Analysis, Strategic Options (2-3 with pros/cons), Recommended Approach, Implementation Roadmap, Next Steps (next 2 weeks). Professional tone, senior leadership audience. Specific to my situation, no filler.`,
  data: `Now create my analysis as an Excel workbook. Include: Analysis Summary, Key Metrics Dashboard (table with metrics, values, targets), Data Breakdown (tables by category), Key Findings (3-5 numbered with figures), Risk Factors, Recommended Actions (prioritised). Use tables throughout. Flag any estimates.`,
  deck: `Now create my presentation as a PowerPoint deck. 8 slides: Title, Challenge, Current Situation, Approach (2 slides), Evidence/Data, Roadmap, Next Steps & Ask. Each slide: title, 3-4 bullets max, speaker notes. No slide over 5 bullets. Tell a story.`,
  comms: `Now draft my communication. Include: Subject line, Opening (why + why it matters), Context (1 paragraph), Key Message, What This Means For You, Action Needed (with deadline), Closing. Professional but human tone. Under 400 words. Ready to send.`,
  researcher: `Now produce my research report as a Word document. Sections: Executive Summary (3-4 sentences, standalone), Context & Background, Key Findings (5-7 numbered with evidence), Landscape Overview, Implications for Nestlé, Strategic Options (2-3), Sources with links. Senior leader audience. Insight over volume.`,
  analyst: `Now produce my analysis report as a Word document. Sections: Analysis Summary, Key Metrics Overview (table with actuals, targets, variances), Top Findings (5 numbered with supporting data), Visual Breakdown (charts/tables by relevant dimensions), Root Causes, Recommended Actions (3, prioritised). Clear and visual for senior leadership.`,
};
