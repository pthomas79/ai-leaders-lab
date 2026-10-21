function lab() {
  return {
    step: 1,
    maxStep: 1,
    selectedType: null,
    stepLabels: ['Choose', 'Context', 'Conversation', 'Refine', 'Produce'],

    get isAgent() {
      return this.selectedType === 'researcher' || this.selectedType === 'analyst';
    },

    get agentName() {
      return this.selectedType === 'researcher' ? 'Researcher' : 'Analyst';
    },

    cards: [
      {
        type: 'doc', number: '01', title: 'Strategic Document',
        desc: 'A Word brief, proposal or plan with clear recommendations.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00396F" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      },
      {
        type: 'data', number: '02', title: 'Data-Backed Analysis',
        desc: 'An Excel analysis with metrics and key findings.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00396F" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      },
      {
        type: 'deck', number: '03', title: 'Presentation',
        desc: 'A PowerPoint deck with talking points and a clear story.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00396F" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
      },
      {
        type: 'comms', number: '04', title: 'Stakeholder Communication',
        desc: 'A polished email or memo for your stakeholders.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00396F" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      },
      {
        type: 'researcher', number: '05', title: 'Deep Research Report',
        desc: 'Multi-source research on any topic, with citations.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        iconBg: '#F5F3FF',
        agentTag: 'Researcher agent',
      },
      {
        type: 'analyst', number: '06', title: 'Data Analysis',
        desc: 'Charts and insights from your own Excel or CSV file.',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
        iconBg: '#F5F3FF',
        agentTag: 'Analyst agent',
      },
    ],

    contextPrompts,

    generatePrompts,

    // Escape the prompt text and wrap [placeholders] in a highlight span.
    // Copying uses textContent, so the copied prompt is unchanged plain text.
    highlight(text) {
      const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return esc.replace(/\[[^\]]+\]/g, (m) => '<span class="fill-in">' + m + '</span>');
    },

    // Microsoft 365 Copilot Chat (official entry point, see Microsoft Learn "Overview of Microsoft Copilot Chat").
    copilotUrl: 'https://m365.cloud.microsoft/chat',
    nextLabels: ['Continue →', 'Next: Conversation →', 'Next: Refine →', 'Next: Produce →', 'Done ✓'],
    copiedKey: null,
    toast: { show: false, msg: '', link: false },
    _toastTimer: null,

    goTo(s) {
      if (s < 1) return;
      // Fold any expanded sections again when starting over, so each option opens compact.
      if (s === 1) document.querySelectorAll('details.more').forEach((d) => { d.open = false; });
      this.step = s;
      if (s > this.maxStep) this.maxStep = s;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    next() {
      if (this.step === 1 && !this.selectedType) return;
      this.goTo(this.step + 1);
    },

    // Prompt shown on the current step (used by the mobile bar's Copy button).
    get currentPromptRef() {
      return this.step === 2 ? 'contextPrompt' : this.step === 5 ? 'generatePrompt' : null;
    },

    // Start the clipboard write synchronously inside the click (needed on iOS Safari),
    // with a textarea + execCommand fallback for older or non-secure contexts.
    writeClipboard(text) {
      const legacy = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        if (!ok) throw new Error('copy failed');
      };
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).catch(() => legacy());
      }
      try { legacy(); return Promise.resolve(); } catch (e) { return Promise.reject(e); }
    },

    flash(key) {
      this.copiedKey = key;
      setTimeout(() => { if (this.copiedKey === key) this.copiedKey = null; }, 2000);
    },

    showToast(msg, link) {
      this.toast = { show: true, msg, link: !!link };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { this.toast.show = false; }, link ? 9000 : 4500);
    },

    copyOnly(ref) {
      const el = this.$refs[ref];
      if (!el) return;
      this.writeClipboard(el.textContent)
        .then(() => { this.flash(ref); this.showToast('Prompt copied. Paste it into Copilot.', false); })
        .catch(() => this.showToast("Couldn't copy automatically. Select the prompt text and copy it.", false));
    },

    copyAndOpen(ref) {
      const el = this.$refs[ref];
      if (!el) return;
      const copying = this.writeClipboard(el.textContent); // starts within the click, before window.open
      let win = null;
      try { win = window.open(this.copilotUrl, '_blank'); } catch (e) { win = null; }
      if (win) { try { win.opener = null; } catch (e) { /* ignore */ } }
      copying
        .then(() => {
          this.flash(ref);
          if (win) this.showToast('Prompt copied. Copilot is opening in a new tab: paste it there.', false);
          else this.showToast('Prompt copied. Your browser blocked the new tab, so open Copilot here:', true);
        })
        .catch(() => {
          this.showToast(win ? "Copilot opened, but the prompt wasn't copied. Use Copy, then paste."
                             : "Couldn't copy or open a new tab. Use Copy, then open Copilot here:", !win);
        });
    },
  };
}
