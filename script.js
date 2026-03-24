function lab() {
  return {
    step: 1,
    maxStep: 1,
    selectedType: null,
    stepLabels: ['Choose Output', 'Set Context', 'Get Deliverable'],

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

    contextPrompts,

    generatePrompts,

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
