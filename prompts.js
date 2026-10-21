// First prompts (Context). [Square brackets] are fill-in blanks and are highlighted on screen.
const INTERVIEW = `Keep your responses concise and direct. No filler, no preamble. Ask sharp questions, give straight answers.

Interview me one question at a time, up to 6 questions. Then play back what you've understood so far, and wait for me to confirm or correct it before we go further.`;

// Second prompts (Produce) all end with this line.
const VERIFY = `Clearly mark anything you assumed, estimated or that I should verify.`;

const contextPrompts = {
  doc: `What I need: [The decision, plan or proposal you need to deliver in the coming weeks]
Who it's for: [Who will read it, e.g. your leadership team, a client, your own team]
What good looks like: [The outcome you want, e.g. a decision made, budget approved, team aligned]

Help me produce a strategic document I can share with leadership, created as a Word document. ${INTERVIEW}`,
  data: `What I need: [The decision or question where data and analysis would help]
Who it's for: [Who will use the analysis]
What good looks like: [What you want to be able to say or decide at the end]

Help me produce a data-backed analysis with metrics, key findings and recommendations, created as an Excel workbook. ${INTERVIEW}`,
  deck: `What I need: [What you need to present, and why now]
Who it's for: [Your audience, e.g. stakeholders, your team, leadership]
What good looks like: [What the audience should think, feel or do afterwards]

Help me produce a compelling presentation, created as a PowerPoint deck with talking points. ${INTERVIEW}`,
  comms: `What I need: [What you need to communicate, and why it matters]
Who it's for: [Who will receive it]
What good looks like: [What readers should understand or do after reading]

Help me draft a clear, professional stakeholder communication that is ready to send. ${INTERVIEW}`,
  researcher: `What I need to research: [The topic, e.g. competitive landscape, market trends, best practices, regulatory changes]
This will feed into: [The decision or deliverable that depends on this research]
What good looks like: [What you need to know by the end, and how deep to go]

${INTERVIEW}`,
  analyst: `What I need to analyse: [The data you have attached and what you want to learn from it]
This will inform: [The decision or presentation that depends on this analysis]
What good looks like: [The questions you want answered, e.g. trends, outliers, comparisons]

I've attached my data file. ${INTERVIEW}`,
};

// Second prompts (Produce): Copilot proposes a structure first, waits for OK, then produces the file.
const generatePrompts = {
  doc: `Based on our conversation, propose a structure for my strategic document. You can start from: Executive Summary, Situation, Options (2-3 with pros and cons), Recommendation, Roadmap, Next Steps. Adapt it to my situation and wait for my OK or changes. Then create it as a Word document for a senior leadership audience. ${VERIFY}`,
  data: `Based on our conversation, propose a structure for my analysis. You can start from: Summary, Key Metrics (metric, value, target), Breakdown by category, Key Findings, Risks, Recommended Actions. Adapt it and wait for my OK or changes. Then create it as an Excel workbook with tables. I haven't attached data, so use clearly labelled example figures or ask me for real numbers. Never present invented numbers as fact. ${VERIFY}`,
  deck: `Based on our conversation, propose a storyline for my presentation, slide by slide (a title and one-line purpose for each). You can start from: Title, Challenge, Current Situation, Approach, Evidence, Roadmap, Next Steps and Ask. Wait for my OK or changes. Then create it as a PowerPoint deck with no more than 5 bullets per slide and speaker notes. ${VERIFY}`,
  comms: `Based on our conversation, propose an outline for my message: subject line, key message, main points and the action I'm asking for. Wait for my OK or changes. Then draft it as a ready-to-send email, professional but human, under 400 words. ${VERIFY}`,
  researcher: `Based on our conversation, propose a structure for my research report. You can start from: Executive Summary, Context, Key Findings (with evidence), Landscape Overview, Implications for BSM, Options, Sources with links. Wait for my OK or changes. Then create it as a Word document for a senior leadership audience, with citations. ${VERIFY}`,
  analyst: `Based on our conversation, propose a structure for my analysis report. You can start from: Summary, Key Metrics (actuals, targets, variances), Top Findings, Charts by the most useful dimensions, Root Causes, Recommended Actions. Wait for my OK or changes. Then create it as a Word document with charts and tables, basing every figure on my attached data. ${VERIFY}`,
};
