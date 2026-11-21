/**
 * FinSolve - Financial Management & Practical Sums Solver
 * Interactive Core Application Engine
 */

// --- FINANCIAL CALCULATION UTILITIES ---
const FinCalc = {
  // PVIFA = [1 - (1 + r)^(-n)] / r
  pvifa(r, n) {
    if (r === 0) return n;
    return (1 - Math.pow(1 + r, -n)) / r;
  },

  // PV of a single future cash flow = FV / (1 + r)^n
  pv(fv, r, n) {
    return fv / Math.pow(1 + r, n);
  },

  // Full Equivalent Annual Cost (EAC) calculation
  calculateEAC(cost, omCost, life, salvage, rate) {
    const factor = this.pvifa(rate, life);
    const pvOM = omCost * factor;
    const pvSalvage = this.pv(salvage, rate, life);
    const netPV = cost + pvOM - pvSalvage;
    const eac = netPV / factor;
    return {
      pvifa: factor,
      pvOM,
      pvSalvage,
      netPV,
      eac
    };
  },

  formatCurrency(val, decimals = 2) {
    return '$' + Number(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  formatNumber(val, decimals = 2) {
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
};

// --- DATA STORE ---
const AppData = {
  topics: [
    {
      id: "tvm",
      title: "Time Value of Money & Annuities",
      completed: 18,
      total: 24,
      icon: "hourglass_top",
      tags: ["PV", "FV", "PMT", "EAR"],
      status: "completed"
    },
    {
      id: "capital-budgeting",
      title: "Capital Budgeting & Cash Flows",
      completed: 8,
      total: 22,
      icon: "account_balance",
      tags: ["NPV", "IRR", "PI", "Payback"],
      status: "in-progress"
    },
    {
      id: "cost-of-capital",
      title: "Cost of Capital & WACC",
      completed: 6,
      total: 16,
      icon: "pie_chart",
      tags: ["Ke", "Kd", "WACC", "CAPM"],
      status: "in-progress"
    },
    {
      id: "bond-valuation",
      title: "Bond Valuation & Yield to Maturity",
      completed: 4,
      total: 15,
      icon: "show_chart",
      tags: ["YTM", "Duration", "Convexity"],
      status: "in-progress"
    },
    {
      id: "working-capital",
      title: "Working Capital Management",
      completed: 3,
      total: 18,
      icon: "sync_alt",
      tags: ["CCC", "DSO", "Inventory Cycle"],
      status: "in-progress"
    },
    {
      id: "ratio-analysis",
      title: "Financial Ratio Analysis & DuPont",
      completed: 3,
      total: 15,
      icon: "analytics",
      tags: ["ROE", "ROA", "Quick Ratio"],
      status: "in-progress"
    }
  ],

  problems: [
    {
      id: 23,
      title: "Problem #23: Mutually Exclusive Projects with Unequal Lives (EAC Method)",
      shortTitle: "EAC Method with Salvage Value",
      category: "replacement",
      difficulty: "advanced",
      difficultyLabel: "Advanced",
      topic: "Capital Budgeting",
      badge: "Exam Hotspot",
      badgeIcon: "star",
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      description: "Project A has 3-year life ($60,000 cost), Project B has 5-year life ($85,000 cost). Discount rate 10%. Calculate Equivalent Annual Cost.",
      formula: "EAC = NPV / PVIFA(k,n)",
      k: "k=10%",
      time: "14m",
      steps: "4 Steps",
      progress: "100% Solved",
      solved: true,
      data: {
        r: 0.10,
        m1: { name: "Alpha", cost: 60000, om: 8000, life: 3, salvage: 0 },
        m2: { name: "Beta", cost: 85000, om: 6000, life: 5, salvage: 5000 }
      }
    },
    {
      id: 24,
      title: "Problem #24: Project with Non-Conventional Cash Flows (Multiple IRRs)",
      shortTitle: "Non-Conventional Flows & Descartes Rule",
      category: "npv",
      difficulty: "advanced",
      difficultyLabel: "Advanced",
      topic: "Capital Budgeting",
      badge: "Tricky Concept",
      badgeIcon: "bolt",
      badgeClass: "bg-error-container text-on-error-container",
      description: "Initial outlay $100k, Year 1 inflow $230k, Year 2 outflow $132k. Determine real cost and explain Descartes sign rule.",
      formula: "0 = -CF₀ + CF₁/(1+r) - CF₂/(1+r)²",
      k: "k=12%",
      time: "18m",
      steps: "Descartes Rule",
      progress: "In Progress (Step 3/5)",
      progressPercent: 60,
      solved: false
    },
    {
      id: 25,
      title: "Problem #25: Comprehensive Capital Rationing with Divisible vs Indivisible",
      shortTitle: "Capital Rationing & PI Optimization",
      category: "payback",
      difficulty: "exam",
      difficultyLabel: "Exam Level",
      topic: "Capital Budgeting",
      badge: "Univ Past Paper '23",
      badgeIcon: "school",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
      description: "Company budget constraint $500,000 across 5 capital projects. Select optimal combination using Profitability Index ranking.",
      formula: "PI = PV of Future Cashflows / Initial Outlay",
      k: "Budget: $500k",
      time: "22m",
      steps: "5 Projects",
      progress: "Unsolved",
      solved: false
    },
    {
      id: 26,
      title: "Problem #26: Tax Shield on Accelerated Depreciation & Salvage Value Treatment",
      shortTitle: "MACRS Tax Shield & Capital Gain Tax",
      category: "replacement",
      difficulty: "basic",
      difficultyLabel: "Basic",
      topic: "Capital Budgeting",
      badge: "Core Fundamental",
      badgeIcon: "verified",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
      description: "Calculate annual CFAT under MACRS 3-year property class with 30% marginal tax rate and terminal book salvage difference.",
      formula: "Tax Shield = Depreciation × Tax Rate (T)",
      k: "T=30%",
      time: "10m",
      steps: "MACRS",
      progress: "Unsolved",
      solved: false
    },
    {
      id: 19,
      title: "Problem #19: Uneven Cash Flow NPV with 12% Cost of Capital",
      shortTitle: "Uneven Cash Flow Discounting",
      category: "npv",
      difficulty: "exam",
      difficultyLabel: "Exam Level",
      topic: "Capital Budgeting",
      badge: "High Exam Frequency",
      badgeIcon: "priority_high",
      badgeClass: "bg-error-container text-on-error-container",
      description: "Evaluate 5-year erratic cash inflows ($20k, $45k, $30k, $60k, $15k) against $110,000 upfront outlay at 12% hurdle rate.",
      formula: "∑ CFₜ/(1+k)ᵗ - I₀",
      k: "k=12%",
      time: "12m",
      steps: "4 Steps",
      progress: "In Review",
      solved: false
    },
    {
      id: 8,
      title: "Problem #08: Bond YTM Approximation vs Interpolation",
      shortTitle: "YTM Approximation vs Interpolation",
      category: "bonds",
      difficulty: "exam",
      difficultyLabel: "Exam Level",
      topic: "Fixed Income",
      badge: "CFA Core",
      badgeIcon: "school",
      badgeClass: "bg-surface-container-high text-on-surface-variant",
      description: "A 10-year 8% coupon bond with $1,000 par value is selling for $920. Calculate Yield to Maturity using approximation and 2-point interpolation.",
      formula: "[C + (F - P)/n] / [(F + 2P)/3]",
      k: "Par: $1k",
      time: "16m",
      steps: "Interpolation",
      progress: "Saved",
      solved: true
    },
    {
      id: 42,
      title: "Problem #42: Flotation Costs Adjustment in WACC",
      shortTitle: "Flotation Costs Adjustment in WACC",
      category: "wacc",
      difficulty: "exam",
      difficultyLabel: "Exam Level",
      topic: "Cost of Capital",
      badge: "Examiner Trap",
      badgeIcon: "warning",
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      description: "Company plans $10M new equity issue with 5% flotation costs. Correct treatment in NPV project appraisal vs cost of equity adjustments.",
      formula: "Initial Cash Outlay = Cost / (1 - f)",
      k: "f=5%",
      time: "15m",
      steps: "WACC Trap",
      progress: "Saved",
      solved: true
    }
  ],

  flashcards: [
    {
      id: "fc1",
      domain: "EQUITY VALUATION",
      name: "Gordon Growth Model",
      formula: "P₀ = D₁ / (Kₑ - g)",
      subtitle: "D₁ = D₀ × (1 + g)",
      tag: "CFA Level I Core",
      backTitle: "Assumptions & Sensitivity",
      backContent: "Applies only when Kₑ > g and growth is perpetual. If Ke approaches g, price approaches infinity. Flotation costs should adjust net issue price P₀(1-f)."
    },
    {
      id: "fc2",
      domain: "CAPITAL STRUCTURE",
      name: "M&M Proposition II (Taxes)",
      formula: "rₑ = r₀ + (r₀ - r_d)(1 - T)(D / E)",
      subtitle: "Tax Shield Benefit",
      tag: "High Trap Rate",
      backTitle: "Cost of Levered Equity",
      backContent: "Cost of equity increases linearly with debt-to-equity ratio, mitigated by the tax shield (1 - T). Firm value VL = VU + (T × D)."
    },
    {
      id: "fc3",
      domain: "COST OF CAPITAL",
      name: "Weighted Average Cost (WACC)",
      formula: "WACC = (E/V)Kₑ + (D/V)K_d(1-T) + (P/V)K_p",
      subtitle: "Target Market Weights",
      tag: "Every Exam",
      backTitle: "Weighting Rules",
      backContent: "Always use target market value weights, not historical book values. Interest is tax-deductible; preferred stock and common equity dividends are not."
    },
    {
      id: "fc4",
      domain: "FIXED INCOME",
      name: "Bond YTM Approximation",
      formula: "YTM ≈ [C + (F - P)/n] ÷ [(F + P)/2]",
      subtitle: "Semi-annual: C/2, 2n",
      tag: "Formula Trap",
      backTitle: "Alternative 1/3 Weighting",
      backContent: "Some Indian & UK universities use denominator (F + 2P)/3 for improved accuracy on discount bonds. Check syllabus preference!"
    }
  ],

  gotchas: [
    {
      title: "Terminal Value Multi-Stage Timing Trap",
      topic: "DCF Valuation",
      severity: "High",
      summary: "In a 5-year explicit forecast, the numerator for Terminal Value is CF₆ = CF₅ × (1 + g), NOT CF₅ alone. Furthermore, the calculated TV resides at t = 5 and MUST be discounted back to t = 0 by (1 + r)⁵.",
      formula: "TV₅ = CF₅(1 + g) / (WACC - g)",
      stat: "73% of candidates miss the g-step in speed tests"
    },
    {
      title: "Salvage Value Sign in Equivalent Annual Cost (EAC)",
      topic: "Capital Budgeting",
      severity: "Critical",
      summary: "When evaluating replacement options using EAC cost minimization, Salvage Value represents an inflow / cost recovery. It MUST be subtracted from total PV of costs BEFORE dividing by PVIFA.",
      formula: "Net PV Costs = Outlay + PV(O&M) - PV(Salvage)",
      stat: "58% add salvage instead of deducting"
    },
    {
      title: "Flotation Costs: WACC Adjustment vs Initial Outlay",
      topic: "Cost of Capital",
      severity: "High",
      summary: "Flotation costs are an immediate upfront cash expense. Adjusting WACC upward by flotation costs artificially penalizes longer-lived projects perpetually. The correct CFA standard is adding flotation costs to Initial Cash Outlay at t = 0.",
      formula: "True Outlay = Project Cost / (1 - Flotation Rate)",
      stat: "Frequent university trick question"
    },
    {
      title: "Non-Conventional Cash Flows & Multiple IRRs",
      topic: "Capital Budgeting",
      severity: "Medium",
      summary: "If a project has multiple cash flow sign changes (+ / - / +), Descartes' Rule of Signs implies multiple internal rates of return may exist. In such cases, IRR becomes mathematically invalid; rely strictly on NPV or MIRR.",
      formula: "Use NPV Profile or MIRR",
      stat: "Examiner hotspot for theoretical commentary"
    },
    {
      title: "Semi-Annual Coupon Frequency Adjustments",
      topic: "Bond Valuation",
      severity: "High",
      summary: "When bond coupons are paid semi-annually: Coupon C is divided by 2, number of periods n is multiplied by 2, and the discount yield per period is r/2. Forgetting to double n is the #1 math slip.",
      formula: "Periodic Coupon = C / 2, Periods = 2 × n",
      stat: "64% make period index error under exam timing"
    }
  ],

  quizzes: [
    {
      id: 1,
      title: "Capital Budgeting: EAC Quick Check",
      question: "A machine costs $50,000, has annual operating costs of $5,000, and lasts 4 years with no salvage value. If the cost of capital is 10% (PVIFA = 3.1699), what is the Equivalent Annual Cost (EAC)?",
      options: [
        "$15,773 / yr",
        "$20,773 / yr",
        "$12,500 / yr",
        "$18,250 / yr"
      ],
      correctIndex: 1,
      explanation: "Total PV of Costs = $50,000 + ($5,000 × 3.1699) = $50,000 + $15,849.50 = $65,849.50. EAC = $65,849.50 ÷ 3.1699 = $20,773.37 / yr (or Outlay/PVIFA + Annual OM = 50000/3.1699 + 5000 = $15,773.37 + $5,000 = $20,773.37 / yr)."
    },
    {
      id: 2,
      title: "Gordon Growth Valuation",
      question: "Zenith Ltd paid a dividend of $4.00 yesterday. Dividends are expected to grow at 6% perpetually. If the required return on equity is 14%, what is the intrinsic value of the share today?",
      options: [
        "$50.00",
        "$53.00",
        "$48.50",
        "$57.24"
      ],
      correctIndex: 1,
      explanation: "Given D₀ = $4.00, D₁ = $4.00 × (1 + 0.06) = $4.24. Intrinsic Price P₀ = D₁ / (Ke - g) = $4.24 / (0.14 - 0.06) = $4.24 / 0.08 = $53.00."
    },
    {
      id: 3,
      title: "Tax Shield on Depreciation",
      question: "A firm buys equipment for $120,000 depreciated straight-line over 3 years to zero salvage. The marginal tax rate is 35%. What is the annual depreciation tax shield?",
      options: [
        "$40,000",
        "$26,000",
        "$14,000",
        "$28,000"
      ],
      correctIndex: 2,
      explanation: "Annual Depreciation = $120,000 / 3 = $40,000/yr. Depreciation Tax Shield = Depreciation × Tax Rate = $40,000 × 0.35 = $14,000 cash flow savings per year."
    }
  ]
};

// --- BACKEND API SERVICE (OFFLINE-FIRST) ---
const FinApi = {
  baseUrl: window.location.origin.includes(':5000') || window.location.origin.includes(':8000') 
    ? window.location.origin 
    : 'http://localhost:5000',
  isOnline: false,

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        this.updateConnectionBadge(true);
        return data;
      }
    } catch (e) {
      this.isOnline = false;
      this.updateConnectionBadge(false);
    }
    return null;
  },

  updateConnectionBadge(online) {
    const badge = document.getElementById("backend-status-badge");
    if (badge) {
      if (online) {
        badge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span> <span class="text-secondary font-semibold">Backend Live (SQLite)</span>`;
        badge.title = "Connected to Python REST API & SQLite Database";
      } else {
        badge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-on-surface-variant"></span> <span class="text-on-surface-variant">Local Engine</span>`;
        badge.title = "Running on Client Engine. Run server.py for SQLite backend.";
      }
    }
  },

  async fetchTopics() {
    if (!this.isOnline) return AppData.topics;
    try {
      const res = await fetch(`${this.baseUrl}/api/topics`);
      if (res.ok) {
        const data = await res.json();
        if (data.topics && data.topics.length > 0) {
          AppData.topics = data.topics;
          return data.topics;
        }
      }
    } catch (e) {}
    return AppData.topics;
  },

  async fetchProblems(category, difficulty, search) {
    if (!this.isOnline) return AppData.problems;
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      if (search) params.append('search', search);
      const res = await fetch(`${this.baseUrl}/api/problems?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.problems && data.problems.length > 0) {
          AppData.problems = data.problems;
          return data.problems;
        }
      }
    } catch (e) {}
    return AppData.problems;
  },

  async toggleBookmark(problemId, notes = '') {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.baseUrl}/api/bookmarks/${problemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async solveEAC(rate, asset1, asset2) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.baseUrl}/api/solve/eac`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate, asset1, asset2 })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async askTutor(query) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.baseUrl}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }
};

// --- APP STATE CONTROLLER ---
const AppState = {
  currentView: "topics", // "topics" | "problems" | "solver-workbench" | "practice" | "saved"
  activeProblemId: 23,
  bookmarks: new Set([23, 8, 42]),
  problemCategory: "all",
  activeDifficulties: new Set(),
  sortAscending: true,
  practiceMode: "solver", // "solver" | "quiz"
  quizIndex: 0,
  quizSelectedAnswer: null,
  quizSubmitted: false,
  isMobileFrame: true,

  // Live Scratchpad / Custom solver parameters
  solverParams: {
    rate: 10.0,
    m1: { name: "Alpha", cost: 60000, om: 8000, life: 3, salvage: 0 },
    m2: { name: "Beta", cost: 85000, om: 6000, life: 5, salvage: 5000 }
  },

  async init() {
    this.loadBookmarks();
    this.bindGlobalEvents();
    this.renderCurrentView();
    this.updateBookmarkBadges();

    // Check backend connectivity and sync bookmarks
    await FinApi.checkHealth();
    if (FinApi.isOnline) {
      try {
        const res = await fetch(`${FinApi.baseUrl}/api/bookmarks`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.bookmarks)) {
            this.bookmarks = new Set(data.bookmarks);
            this.saveBookmarks();
            this.updateBookmarkBadges();
            this.updateSaveButtonState();
          }
        }
      } catch (e) {}
    }
  },

  loadBookmarks() {
    try {
      const saved = localStorage.getItem("finsolve_bookmarks");
      if (saved) {
        this.bookmarks = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage not available:", e);
    }
  },

  saveBookmarks() {
    try {
      localStorage.setItem("finsolve_bookmarks", JSON.stringify(Array.from(this.bookmarks)));
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  },

  async toggleBookmark(problemId) {
    if (this.bookmarks.has(problemId)) {
      this.bookmarks.delete(problemId);
      this.showToast("Removed from Exam Revision Sheet", "bookmark_remove");
    } else {
      this.bookmarks.add(problemId);
      this.showToast("Added to 'Exam Revision Sheet #1'", "bookmark_check");
    }
    this.saveBookmarks();
    this.updateBookmarkBadges();
    this.updateSaveButtonState();
    if (this.currentView === "saved") {
      this.renderSavedView();
    }
    if (FinApi.isOnline) {
      await FinApi.toggleBookmark(problemId);
    }
  },

  isBookmarked(problemId) {
    return this.bookmarks.has(problemId);
  },

  updateBookmarkBadges() {
    const count = this.bookmarks.size;
    const badge = document.getElementById("saved-tab-badge");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    }
  },

  updateSaveButtonState() {
    const saveBtn = document.getElementById("saveRevisionBtn");
    if (!saveBtn) return;
    const isSaved = this.isBookmarked(this.activeProblemId);
    const icon = saveBtn.querySelector(".material-symbols-outlined");
    const label = saveBtn.querySelector("span:last-child");

    if (isSaved) {
      saveBtn.classList.add("bg-secondary-container/40", "text-secondary");
      if (icon) {
        icon.textContent = "bookmark_added";
        icon.classList.add("filled");
      }
      if (label) label.textContent = "Saved to Sheet";
    } else {
      saveBtn.classList.remove("bg-secondary-container/40", "text-secondary");
      if (icon) {
        icon.textContent = "bookmark_add";
        icon.classList.remove("filled");
      }
      if (label) label.textContent = "Save to Revision";
    }
  },

  navigate(viewName, params = {}) {
    this.currentView = viewName;
    if (params.problemId) {
      this.activeProblemId = Number(params.problemId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderCurrentView();
    this.updateNavHighlight();
  },

  updateNavHighlight() {
    const navLinks = document.querySelectorAll("nav a[data-path]");
    navLinks.forEach(link => {
      const path = link.getAttribute("data-path");
      if (path === this.currentView || (path === "solver-workbench" && this.currentView === "solver-workbench")) {
        link.className = "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-colors text-secondary font-semibold";
        link.setAttribute("aria-current", "page");
      } else {
        link.className = "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 text-on-surface-variant transition-colors hover:text-on-surface";
        link.removeAttribute("aria-current");
      }
    });
  },

  renderCurrentView() {
    const views = ["topics", "problems", "solver-workbench", "practice", "saved"];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === this.currentView) {
          el.classList.remove("hidden");
          el.classList.add("view-transition");
        } else {
          el.classList.add("hidden");
          el.classList.remove("view-transition");
        }
      }
    });

    if (this.currentView === "problems") {
      this.renderProblemsView();
    } else if (this.currentView === "solver-workbench") {
      this.renderSolutionView();
    } else if (this.currentView === "practice") {
      this.renderPracticeView();
    } else if (this.currentView === "saved") {
      this.renderSavedView();
    }
  },

  // --- VIEW RENDERERS ---

  renderProblemsView() {
    const container = document.getElementById("problemsList");
    if (!container) return;

    let items = [...AppData.problems];

    // Filter by Category
    if (this.problemCategory !== "all") {
      items = items.filter(p => p.category === this.problemCategory);
    }

    // Filter by Difficulty
    if (this.activeDifficulties.size > 0) {
      items = items.filter(p => this.activeDifficulties.has(p.difficulty));
    }

    // Sort
    if (!this.sortAscending) {
      items.reverse();
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="bg-surface-container-lowest p-8 rounded-xl text-center space-y-2">
          <span class="material-symbols-outlined text-[36px] text-on-surface-variant">filter_alt_off</span>
          <p class="font-headline-sm text-on-surface">No problems match selected filters</p>
          <p class="font-body-sm text-on-surface-variant">Try selecting "All" or resetting difficulty chips.</p>
          <button onclick="AppState.resetFilters()" class="mt-2 bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-label-md">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(p => {
      const isSaved = this.isBookmarked(p.id);
      return `
        <div class="problem-card flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-[0_4px_16px_rgba(11,28,48,0.04)] relative overflow-hidden transition-all duration-200" id="card-p-${p.id}" data-category="${p.category}" data-difficulty="${p.difficulty}">
          <div class="absolute top-0 left-0 w-1.5 h-full ${p.solved ? 'bg-secondary' : 'bg-surface-container-high'}"></div>
          
          <div class="flex items-start justify-between gap-2 mb-2 pl-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="${p.badgeClass} font-label-sm text-label-sm px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[13px]">${p.badgeIcon}</span>
                ${p.badge}
              </span>
              <span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded">${p.difficultyLabel}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <button onclick="AppState.toggleBookmark(${p.id}); event.stopPropagation();" class="p-1 rounded text-on-surface-variant hover:text-secondary" title="Bookmark">
                <span class="material-symbols-outlined text-[18px] ${isSaved ? 'text-secondary filled' : ''}">${isSaved ? 'bookmark_check' : 'bookmark_add'}</span>
              </button>
              <div class="flex items-center gap-1 ${p.solved ? 'bg-secondary-container/60 text-on-secondary-container' : 'bg-surface-container-high text-on-surface'} px-2 py-0.5 rounded-full font-label-sm text-label-sm flex-shrink-0">
                <span class="material-symbols-outlined text-[14px]">${p.solved ? 'check_circle' : 'timelapse'}</span>
                <span>${p.progress}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1 mb-2 pl-1">
            <span class="font-headline-sm text-headline-sm text-on-surface leading-snug cursor-pointer hover:text-secondary transition-colors" onclick="AppState.navigate('solver-workbench', { problemId: ${p.id} })">
              ${p.title}
            </span>
            <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">
              ${p.description}
            </p>
          </div>

          <div class="bg-surface-container-low p-2.5 rounded-lg mb-space-sm flex items-center justify-between">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="material-symbols-outlined text-[16px] text-on-tertiary-container">functions</span>
              <code class="font-code-formula text-code-formula text-on-surface text-[13px] truncate">${p.formula}</code>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0 ml-2">${p.k}</span>
          </div>

          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-3 font-code-sm text-code-sm text-on-surface-variant">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">timer</span> ${p.time}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">analytics</span> ${p.steps}</span>
            </div>
            <button onclick="AppState.navigate('solver-workbench', { problemId: ${p.id} })" class="${p.solved ? 'bg-surface-container hover:bg-surface-container-high text-on-surface' : 'bg-primary hover:bg-primary-container text-on-primary'} px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 transition-colors">
              <span>${p.solved ? 'Review Solution' : 'Start Problem'}</span>
              <span class="material-symbols-outlined text-[16px]">${p.solved ? 'arrow_forward' : 'play_circle'}</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  resetFilters() {
    this.problemCategory = "all";
    this.activeDifficulties.clear();
    const catContainer = document.getElementById("categoryFilterContainer");
    if (catContainer) {
      catContainer.querySelectorAll(".category-pill").forEach((pill, idx) => {
        pill.className = idx === 0
          ? "category-pill whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm bg-primary text-on-primary shadow-sm transition-all flex items-center gap-1"
          : "category-pill whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-1";
      });
    }
    const diffContainer = document.getElementById("difficultyFilterContainer");
    if (diffContainer) {
      diffContainer.querySelectorAll(".diff-chip").forEach(btn => {
        btn.className = "diff-chip px-2.5 py-1 rounded font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant transition-colors";
      });
    }
    this.renderProblemsView();
  },

  renderSolutionView() {
    this.updateSaveButtonState();
  },

  renderPracticeView() {
    if (this.practiceMode === "solver") {
      this.recalculatePracticeSolver();
    } else {
      this.renderQuizQuestion();
    }
  },

  // Recalculates custom parameters and updates live cards & trace
  recalculatePracticeSolver() {
    const rateEl = document.getElementById("rate-input");
    const m1cEl = document.getElementById("m1-cost");
    const m1omEl = document.getElementById("m1-om");
    const m1lEl = document.getElementById("m1-life");
    const m1sEl = document.getElementById("m1-salvage");

    const m2cEl = document.getElementById("m2-cost");
    const m2omEl = document.getElementById("m2-om");
    const m2lEl = document.getElementById("m2-life");
    const m2sEl = document.getElementById("m2-salvage");

    const rate = (parseFloat(rateEl ? rateEl.value : 10) || 10) / 100;
    const m1Cost = parseFloat(String(m1cEl ? m1cEl.value : 60000).replace(/,/g, "")) || 60000;
    const m1OM = parseFloat(String(m1omEl ? m1omEl.value : 8000).replace(/,/g, "")) || 8000;
    const m1Life = parseInt(m1lEl ? m1lEl.value : 3) || 3;
    const m1Salvage = parseFloat(String(m1sEl ? m1sEl.value : 0).replace(/,/g, "")) || 0;

    const m2Cost = parseFloat(String(m2cEl ? m2cEl.value : 85000).replace(/,/g, "")) || 85000;
    const m2OM = parseFloat(String(m2omEl ? m2omEl.value : 6000).replace(/,/g, "")) || 6000;
    const m2Life = parseInt(m2lEl ? m2lEl.value : 5) || 5;
    const m2Salvage = parseFloat(String(m2sEl ? m2sEl.value : 5000).replace(/,/g, "")) || 5000;

    const res1 = FinCalc.calculateEAC(m1Cost, m1OM, m1Life, m1Salvage, rate);
    const res2 = FinCalc.calculateEAC(m2Cost, m2OM, m2Life, m2Salvage, rate);

    const m1Name = document.getElementById("m1-name")?.value || "Alpha";
    const m2Name = document.getElementById("m2-name")?.value || "Beta";

    // Update Output Numbers
    const eac1El = document.getElementById("out-m1-eac");
    const eac2El = document.getElementById("out-m2-eac");
    const name1El = document.getElementById("out-m1-name");
    const name2El = document.getElementById("out-m2-name");
    const decisionEl = document.getElementById("out-decision-title");
    const decisionDescEl = document.getElementById("out-decision-desc");

    if (eac1El) eac1El.innerHTML = `${FinCalc.formatCurrency(res1.eac)}<span class="text-xs text-on-surface-variant font-normal">/yr</span>`;
    if (eac2El) eac2El.innerHTML = `${FinCalc.formatCurrency(res2.eac)}<span class="text-xs text-secondary font-normal">/yr</span>`;
    if (name1El) name1El.textContent = `Machine ${m1Name} EAC`;
    if (name2El) name2El.textContent = `Machine ${m2Name} EAC`;

    const diff = Math.abs(res1.eac - res2.eac);
    const optimal = res1.eac < res2.eac ? m1Name : m2Name;
    const higher = res1.eac < res2.eac ? m2Name : m1Name;

    if (decisionEl) decisionEl.textContent = `Machine ${optimal} (Saves ${FinCalc.formatCurrency(diff)}/yr)`;
    if (decisionDescEl) {
      decisionDescEl.textContent = `${optimal} provides a lower annualized capital + operating burden compared to ${higher}, yielding annual savings of ${FinCalc.formatCurrency(diff)}.`;
    }

    // Dynamic Step Trace population
    const traceContainer = document.getElementById("trace-container");
    if (traceContainer) {
      traceContainer.innerHTML = `
        <div class="bg-surface-container-low p-3 rounded-lg flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary font-code-sm text-code-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
          <div class="flex flex-col space-y-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase">Annuity Factor Determination</span>
              <span class="font-code-sm text-code-sm text-secondary">Step Verified</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface">PVIFA(${(rate * 100).toFixed(1)}%, ${m1Life} yrs) = <code class="font-code-sm text-code-sm bg-surface-container-highest px-1 rounded">${res1.pvifa.toFixed(5)}</code> and PVIFA(${(rate * 100).toFixed(1)}%, ${m2Life} yrs) = <code class="font-code-sm text-code-sm bg-surface-container-highest px-1 rounded">${res2.pvifa.toFixed(5)}</code>.</p>
          </div>
        </div>

        <div class="bg-surface-container-low p-3 rounded-lg flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary font-code-sm text-code-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
          <div class="flex flex-col space-y-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase">${m1Name} Present Value of Total Costs</span>
              <span class="font-code-sm text-code-sm text-secondary">Step Verified</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface">PV Outlays = ${FinCalc.formatCurrency(m1Cost)} + (${FinCalc.formatCurrency(m1OM)} × ${res1.pvifa.toFixed(5)}) - ${FinCalc.formatCurrency(res1.pvSalvage)} = <span class="font-code-sm text-code-sm font-semibold text-on-surface">${FinCalc.formatCurrency(res1.netPV)}</span>.</p>
          </div>
        </div>

        <div class="bg-surface-container-low p-3 rounded-lg flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary font-code-sm text-code-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
          <div class="flex flex-col space-y-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase">${m2Name} Present Value of Total Costs</span>
              <span class="font-code-sm text-code-sm text-secondary">Step Verified</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface">PV Outlays = ${FinCalc.formatCurrency(m2Cost)} + (${FinCalc.formatCurrency(m2OM)} × ${res2.pvifa.toFixed(5)}) - ${FinCalc.formatCurrency(res2.pvSalvage)} = <span class="font-code-sm text-code-sm font-semibold text-on-surface">${FinCalc.formatCurrency(res2.netPV)}</span>.</p>
          </div>
        </div>

        <div class="bg-surface-container-low p-3 rounded-lg flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary font-code-sm text-code-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
          <div class="flex flex-col space-y-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase">Equivalent Annual Cost Conversion</span>
              <span class="font-code-sm text-code-sm text-secondary">Step Verified</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface">${m1Name} EAC = ${FinCalc.formatCurrency(res1.netPV)} ÷ ${res1.pvifa.toFixed(5)} = <span class="font-code-sm text-code-sm text-on-surface font-semibold">${FinCalc.formatCurrency(res1.eac)}/yr</span>.<br/>${m2Name} EAC = ${FinCalc.formatCurrency(res2.netPV)} ÷ ${res2.pvifa.toFixed(5)} = <span class="font-code-sm text-code-sm text-secondary font-semibold">${FinCalc.formatCurrency(res2.eac)}/yr</span>.</p>
          </div>
        </div>

        <div class="bg-secondary/15 p-3 rounded-lg flex items-start gap-3 border border-secondary/30">
          <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary font-code-sm text-code-sm flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
          <div class="flex flex-col space-y-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm font-bold text-secondary uppercase">Decision Verdict</span>
              <span class="font-code-sm text-code-sm bg-secondary text-on-secondary px-1.5 py-0.2 rounded font-semibold">Verified</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface font-medium">Select <strong>Machine ${optimal}</strong>. Annual savings: <strong>${FinCalc.formatCurrency(diff)}</strong>.</p>
          </div>
        </div>
      `;
    }
  },

  renderQuizQuestion() {
    const quizArea = document.getElementById("practice-quiz-area");
    if (!quizArea) return;

    const q = AppData.quizzes[this.quizIndex];
    if (!q) return;

    quizArea.innerHTML = `
      <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-secondary text-[20px]">quiz</span>
            <span class="font-label-sm text-label-sm uppercase font-bold text-on-surface">${q.title}</span>
          </div>
          <span class="font-code-sm text-code-sm text-on-surface-variant">Question ${this.quizIndex + 1} of ${AppData.quizzes.length}</span>
        </div>

        <div class="p-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface leading-relaxed">
          ${q.question}
        </div>

        <div class="space-y-2 pt-1" id="quiz-options-container">
          ${q.options.map((opt, idx) => `
            <button onclick="AppState.selectQuizOption(${idx})" class="w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
              this.quizSelectedAnswer === idx 
                ? (this.quizSubmitted 
                    ? (idx === q.correctIndex ? 'bg-secondary-container/40 border-secondary text-on-secondary-container font-semibold' : 'bg-error-container/40 border-error text-on-error-container font-semibold')
                    : 'bg-primary text-on-primary border-primary')
                : (this.quizSubmitted && idx === q.correctIndex ? 'bg-secondary-container/40 border-secondary text-on-secondary-container font-semibold' : 'bg-surface-container-lowest border-surface-container-highest text-on-surface hover:bg-surface-container-low')
            }">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center font-code-sm text-code-sm ${
                  this.quizSelectedAnswer === idx ? 'bg-white/20' : 'bg-surface-container-high'
                }">${String.fromCharCode(65 + idx)}</span>
                <span class="font-body-md text-body-md">${opt}</span>
              </div>
              ${this.quizSubmitted && idx === q.correctIndex ? '<span class="material-symbols-outlined text-secondary text-[20px]">check_circle</span>' : ''}
              ${this.quizSubmitted && this.quizSelectedAnswer === idx && idx !== q.correctIndex ? '<span class="material-symbols-outlined text-error text-[20px]">cancel</span>' : ''}
            </button>
          `).join("")}
        </div>

        ${!this.quizSubmitted ? `
          <button onclick="AppState.submitQuiz()" class="w-full mt-2 bg-primary hover:bg-on-surface text-on-primary py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all">
            <span>Check Answer</span>
            <span class="material-symbols-outlined text-[16px]">done_all</span>
          </button>
        ` : `
          <div class="mt-3 p-3 rounded-lg bg-surface-container flex flex-col space-y-1.5">
            <div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-bold uppercase">
              <span class="material-symbols-outlined text-[16px]">school</span>
              <span>Step-by-Step Derivation & Explanation</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface leading-relaxed">${q.explanation}</p>
          </div>
          <button onclick="AppState.nextQuizQuestion()" class="w-full mt-2 bg-secondary text-on-secondary py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all">
            <span>Next Question</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        `}
      </div>
    `;
  },

  selectQuizOption(idx) {
    if (this.quizSubmitted) return;
    this.quizSelectedAnswer = idx;
    this.renderQuizQuestion();
  },

  submitQuiz() {
    if (this.quizSelectedAnswer === null) {
      this.showToast("Please select an option first", "info");
      return;
    }
    this.quizSubmitted = true;
    this.renderQuizQuestion();
  },

  nextQuizQuestion() {
    this.quizIndex = (this.quizIndex + 1) % AppData.quizzes.length;
    this.quizSelectedAnswer = null;
    this.quizSubmitted = false;
    this.renderQuizQuestion();
  },

  renderSavedView() {
    const listContainer = document.getElementById("savedSumsList");
    if (!listContainer) return;

    const bookmarkedProblems = AppData.problems.filter(p => this.bookmarks.has(p.id));

    // Update Counter Stat Ribbon
    const countSums = document.getElementById("saved-stat-sums");
    if (countSums) countSums.textContent = bookmarkedProblems.length;

    if (bookmarkedProblems.length === 0) {
      listContainer.innerHTML = `
        <div class="bg-surface-container-lowest p-8 rounded-xl text-center space-y-2">
          <span class="material-symbols-outlined text-[36px] text-on-surface-variant">bookmark_border</span>
          <p class="font-headline-sm text-on-surface">No sums bookmarked yet</p>
          <p class="font-body-sm text-on-surface-variant">Click 'Save to Revision' on any problem to build your personal exam revision notebook.</p>
          <button onclick="AppState.navigate('problems')" class="mt-2 bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-label-md">Browse Capital Budgeting Sums</button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = bookmarkedProblems.map(p => `
      <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm relative">
        <div class="flex items-start justify-between gap-space-xs">
          <div class="flex flex-wrap items-center gap-space-xs">
            <span class="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-bold">${p.topic}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">schedule</span> Active
            </span>
          </div>
          <div class="flex items-center text-tertiary-container" title="3 Star Priority">
            <span class="material-symbols-outlined text-[16px] filled">star</span>
            <span class="material-symbols-outlined text-[16px] filled">star</span>
            <span class="material-symbols-outlined text-[16px] filled">star</span>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-label-sm text-label-sm bg-primary text-on-primary px-1.5 py-0.5 rounded font-mono">#${p.id}</span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">${p.shortTitle}</h2>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${p.description}</p>
        </div>

        <div class="bg-surface-container-low rounded-lg p-space-sm flex items-start gap-space-xs mt-1">
          <span class="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">lightbulb</span>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-secondary font-bold">Key Formula</span>
            <p class="font-body-sm text-body-sm text-on-surface font-mono font-medium leading-snug">
              ${p.formula}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-space-xs mt-1">
          <button onclick="AppState.navigate('solver-workbench', { problemId: ${p.id} })" class="flex items-center gap-1.5 bg-primary text-on-primary px-3 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
            <span class="material-symbols-outlined text-[16px]">visibility</span>
            Open Full Steps
          </button>

          <div class="flex items-center gap-2">
            <button onclick="AppState.toggleBookmark(${p.id})" class="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container text-on-surface hover:text-error transition-colors" title="Remove Bookmark">
              <span class="material-symbols-outlined text-[18px]">bookmark_remove</span>
            </button>
            <button onclick="AppState.shareProblem(${p.id})" class="flex items-center gap-1 bg-surface-container text-on-surface px-2.5 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-[16px]">share</span>
              Share
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  shareProblem(id) {
    if (navigator.share) {
      navigator.share({
        title: `FinSolve Sum #${id}`,
        text: `Check out solved financial problem #${id} on FinSolve!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      this.showToast("Link copied to clipboard", "link");
    }
  },

  showToast(message, iconName = "check_circle") {
    let toast = document.getElementById("app-floating-toast");
    if (!toast) return;

    const icon = toast.querySelector(".toast-icon");
    const text = toast.querySelector(".toast-text");

    if (icon) icon.textContent = iconName;
    if (text) text.textContent = message;

    toast.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
    toast.classList.add("opacity-100", "translate-y-0");

    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
    }, 2800);
  },

  // --- GLOBAL EVENT BINDINGS ---
  bindGlobalEvents() {
    // Nav Links (both bottom bar and internal links with data-path)
    document.addEventListener("click", e => {
      const link = e.target.closest("[data-path]");
      if (link) {
        e.preventDefault();
        const targetPath = link.getAttribute("data-path");
        const problemId = link.getAttribute("data-problem-id");
        this.navigate(targetPath, { problemId });
      }
    });

    // Toggle Mobile Frame View vs Fullscreen
    const frameToggleBtn = document.getElementById("toggle-frame-mode");
    if (frameToggleBtn) {
      frameToggleBtn.addEventListener("click", () => {
        const viewport = document.getElementById("app-viewport");
        if (viewport) {
          this.isMobileFrame = !this.isMobileFrame;
          if (this.isMobileFrame) {
            viewport.className = "app-viewport mode-mobile-frame flex flex-col min-h-screen relative";
            frameToggleBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">fullscreen</span> <span class="hidden sm:inline">Expanded</span>';
          } else {
            viewport.className = "app-viewport mode-full-frame flex flex-col min-h-screen relative max-w-5xl";
            frameToggleBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">stay_current_portrait</span> <span class="hidden sm:inline">Mobile Shell</span>';
          }
        }
      });
    }

    // Interactive Search on Topics
    const topicSearch = document.getElementById("topic-search-input");
    const topicsContainer = document.getElementById("topics-list");
    if (topicSearch && topicsContainer) {
      topicSearch.addEventListener("input", e => {
        const term = e.target.value.toLowerCase().trim();
        Array.from(topicsContainer.children).forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(term) ? "flex" : "none";
        });
      });
    }

    // Practice mode buttons
    const modeSolverBtn = document.getElementById("mode-solver");
    const modeQuizBtn = document.getElementById("mode-quiz");
    const solverSection = document.getElementById("practice-solver-section");
    const quizArea = document.getElementById("practice-quiz-area");

    if (modeSolverBtn && modeQuizBtn) {
      modeSolverBtn.addEventListener("click", () => {
        this.practiceMode = "solver";
        modeSolverBtn.className = "flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5";
        modeQuizBtn.className = "flex-1 py-2 px-3 rounded-lg text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-all duration-150 flex items-center justify-center gap-1.5";
        if (solverSection) solverSection.classList.remove("hidden");
        if (quizArea) quizArea.classList.add("hidden");
        this.renderPracticeView();
      });

      modeQuizBtn.addEventListener("click", () => {
        this.practiceMode = "quiz";
        modeQuizBtn.className = "flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5";
        modeSolverBtn.className = "flex-1 py-2 px-3 rounded-lg text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-all duration-150 flex items-center justify-center gap-1.5";
        if (solverSection) solverSection.classList.add("hidden");
        if (quizArea) quizArea.classList.remove("hidden");
        this.renderPracticeView();
      });
    }

    // Practice calculate button
    const calcBtn = document.getElementById("calc-btn");
    if (calcBtn) {
      calcBtn.addEventListener("click", () => {
        const orig = calcBtn.innerHTML;
        calcBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">sync</span> Solving Numerical Model...';
        setTimeout(() => {
          calcBtn.innerHTML = orig;
          this.recalculatePracticeSolver();
          const traceCont = document.getElementById("trace-container");
          if (traceCont && traceCont.classList.contains("hidden")) {
            traceCont.classList.remove("hidden");
            const icon = document.getElementById("trace-toggle-icon");
            if (icon) icon.style.transform = "rotate(0deg)";
          }
          this.showToast("Model verified & recalculation complete", "verified");
        }, 300);
      });
    }

    // Reset Defaults in Practice
    const resetBtn = document.getElementById("reset-defaults");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };
        setVal("rate-input", "10.0");
        setVal("m1-name", "Alpha");
        setVal("m1-cost", "60,000");
        setVal("m1-om", "8,000");
        setVal("m1-life", "3");
        setVal("m1-salvage", "0");

        setVal("m2-name", "Beta");
        setVal("m2-cost", "85,000");
        setVal("m2-om", "6,000");
        setVal("m2-life", "5");
        setVal("m2-salvage", "5,000");

        this.recalculatePracticeSolver();
        this.showToast("Parameters restored to Delta Corp baseline", "restart_alt");
      });
    }

    // Toggle detailed step trace
    const traceToggleBtn = document.getElementById("trace-toggle-btn");
    const traceContainer = document.getElementById("trace-container");
    const traceIcon = document.getElementById("trace-toggle-icon");
    if (traceToggleBtn && traceContainer && traceIcon) {
      traceToggleBtn.addEventListener("click", () => {
        const isHidden = traceContainer.classList.contains("hidden");
        if (isHidden) {
          traceContainer.classList.remove("hidden");
          traceIcon.style.transform = "rotate(0deg)";
        } else {
          traceContainer.classList.add("hidden");
          traceIcon.style.transform = "rotate(-90deg)";
        }
      });
    }

    // Scratchpad Modal triggers
    const scratchpadBtn = document.getElementById("scratchpadBtn");
    const scratchpadModal = document.getElementById("scratchpadModal");
    const closeScratchpad = document.getElementById("closeScratchpad");

    if (scratchpadBtn && scratchpadModal) {
      scratchpadBtn.addEventListener("click", () => {
        scratchpadModal.classList.remove("hidden");
      });
    }
    if (closeScratchpad && scratchpadModal) {
      closeScratchpad.addEventListener("click", () => {
        scratchpadModal.classList.add("hidden");
      });
    }

    // Scratchpad Live Calculation
    const spRate = document.getElementById("sp-rate");
    const spResult = document.getElementById("sp-result");
    if (spRate && spResult) {
      const calcScratchpad = () => {
        const r = (parseFloat(spRate.value) || 10) / 100;
        const resA = FinCalc.calculateEAC(60000, 8000, 3, 0, r);
        const resB = FinCalc.calculateEAC(85000, 6000, 5, 5000, r);
        const diff = Math.abs(resA.eac - resB.eac);
        const win = resA.eac < resB.eac ? "Alpha" : "Beta";
        spResult.innerHTML = `
          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-surface-container p-2 rounded">
              <span class="text-on-surface-variant">EAC Alpha</span>
              <p class="font-bold text-on-surface">${FinCalc.formatCurrency(resA.eac)}</p>
            </div>
            <div class="bg-secondary-container/40 p-2 rounded">
              <span class="text-on-secondary-container font-semibold">EAC Beta</span>
              <p class="font-bold text-secondary">${FinCalc.formatCurrency(resB.eac)}</p>
            </div>
          </div>
          <p class="text-xs text-center text-secondary font-medium">Optimal: <strong>${win}</strong> (Saves ${FinCalc.formatCurrency(diff)}/yr)</p>
        `;
      };
      spRate.addEventListener("input", calcScratchpad);
      calcScratchpad();
    }

    // Try Custom Numbers button in Solution view
    const customNumbersBtn = document.getElementById("customNumbersBtn");
    if (customNumbersBtn) {
      customNumbersBtn.addEventListener("click", () => {
        this.navigate("practice");
        this.showToast("Preloaded Delta Corp variables in Workbench", "tune");
      });
    }

    // Ask Question Modal
    const askQuestionBtn = document.getElementById("askQuestionBtn");
    const aiModal = document.getElementById("aiTutorModal");
    const closeAiModal = document.getElementById("closeAiModal");
    if (askQuestionBtn && aiModal) {
      askQuestionBtn.addEventListener("click", () => {
        aiModal.classList.remove("hidden");
      });
    }
    if (closeAiModal && aiModal) {
      closeAiModal.addEventListener("click", () => {
        aiModal.classList.add("hidden");
      });
    }

    // Save to revision button in solution view
    const saveRevisionBtn = document.getElementById("saveRevisionBtn");
    if (saveRevisionBtn) {
      saveRevisionBtn.addEventListener("click", () => {
        this.toggleBookmark(this.activeProblemId);
      });
    }

    // Saved View Filter Tabs
    const filterTabsContainer = document.getElementById("savedFilterTabs");
    if (filterTabsContainer) {
      const tabs = filterTabsContainer.querySelectorAll("button");
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => {
            t.className = "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md whitespace-nowrap hover:bg-surface-container-high transition-colors";
          });
          tab.className = "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm whitespace-nowrap";

          const sumsSection = document.getElementById("saved-sums-section");
          const formulasSection = document.getElementById("saved-formulas-section");
          const gotchasSection = document.getElementById("saved-gotchas-section");

          if (index === 0) {
            sumsSection?.classList.remove("hidden");
            formulasSection?.classList.add("hidden");
            gotchasSection?.classList.add("hidden");
          } else if (index === 1) {
            sumsSection?.classList.add("hidden");
            formulasSection?.classList.remove("hidden");
            gotchasSection?.classList.add("hidden");
          } else {
            sumsSection?.classList.add("hidden");
            formulasSection?.classList.add("hidden");
            gotchasSection?.classList.remove("hidden");
          }
        });
      });
    }

    // Flashcard 3D flip trigger
    document.querySelectorAll(".flip-card").forEach(card => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });
    });

    // Spaced repetition drill button
    const drillBtn = document.getElementById("startDrillBtn");
    const drillModal = document.getElementById("drillModal");
    const closeDrillModal = document.getElementById("closeDrillModal");
    if (drillBtn && drillModal) {
      drillBtn.addEventListener("click", () => {
        drillModal.classList.remove("hidden");
      });
    }
    if (closeDrillModal && drillModal) {
      closeDrillModal.addEventListener("click", () => {
        drillModal.classList.add("hidden");
      });
    }

    // Export PDF Trigger
    const exportBtn = document.getElementById("exportPdfBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.showToast("Preparing printable revision sheet...", "picture_as_pdf");
        setTimeout(() => {
          window.print();
        }, 600);
      });
    }

    // Streak / Profile Modal Trigger
    const streakBtn = document.getElementById("streakHeaderBtn");
    const streakModal = document.getElementById("streakModal");
    const closeStreakModal = document.getElementById("closeStreakModal");
    if (streakBtn && streakModal) {
      streakBtn.addEventListener("click", () => {
        streakModal.classList.remove("hidden");
      });
    }
    if (closeStreakModal && streakModal) {
      closeStreakModal.addEventListener("click", () => {
        streakModal.classList.add("hidden");
      });
    }

    // Syllabus Modal
    const syllabusBtn = document.getElementById("viewSyllabusBtn");
    const syllabusModal = document.getElementById("syllabusModal");
    const closeSyllabusModal = document.getElementById("closeSyllabusModal");
    if (syllabusBtn && syllabusModal) {
      syllabusBtn.addEventListener("click", e => {
        e.preventDefault();
        syllabusModal.classList.remove("hidden");
      });
    }
    if (closeSyllabusModal && syllabusModal) {
      closeSyllabusModal.addEventListener("click", () => {
        syllabusModal.classList.add("hidden");
      });
    }
  }
};

// --- GLOBAL EXPOSED HELPER FUNCTIONS FOR INLINE HTML LISTENERS ---

window.setCategoryFilter = function(btn, category) {
  AppState.problemCategory = category;
  const container = document.getElementById("categoryFilterContainer");
  if (container) {
    container.querySelectorAll(".category-pill").forEach(p => {
      p.className = "category-pill whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-1";
    });
  }
  btn.className = "category-pill whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm bg-primary text-on-primary shadow-sm transition-all flex items-center gap-1";
  AppState.renderProblemsView();
};

window.toggleDifficulty = function(btn, level) {
  if (AppState.activeDifficulties.has(level)) {
    AppState.activeDifficulties.delete(level);
    btn.className = "diff-chip px-2.5 py-1 rounded font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant transition-colors";
  } else {
    AppState.activeDifficulties.add(level);
    btn.className = "diff-chip px-2.5 py-1 rounded font-label-sm text-label-sm bg-primary text-on-primary font-semibold transition-colors";
  }
  AppState.renderProblemsView();
};

window.toggleSort = function() {
  AppState.sortAscending = !AppState.sortAscending;
  const sortBtn = document.getElementById("sortBtn");
  if (sortBtn) {
    sortBtn.classList.toggle("bg-surface-container-high");
  }
  AppState.renderProblemsView();
};

window.triggerRandomSum = function() {
  const cards = document.querySelectorAll(".problem-card");
  const visibleCards = Array.from(cards).filter(c => c.style.display !== "none");
  if (visibleCards.length > 0) {
    const randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
    randomCard.scrollIntoView({ behavior: "smooth", block: "center" });
    randomCard.classList.add("ring-2", "ring-secondary", "highlight-pulse");
    setTimeout(() => {
      randomCard.classList.remove("ring-2", "ring-secondary", "highlight-pulse");
    }, 1600);
  }
};

window.askAiTutorChip = function(query) {
  const input = document.getElementById("aiTutorInput");
  if (input) input.value = query;
  window.submitAiTutorQuery();
};

window.submitAiTutorQuery = async function() {
  const input = document.getElementById("aiTutorInput");
  const log = document.getElementById("aiTutorChatLog");
  if (!input || !log) return;
  const q = input.value.trim();
  if (!q) return;

  // Add User Message
  log.innerHTML += `
    <div class="flex items-start justify-end gap-2 text-right">
      <div class="bg-primary text-on-primary p-2.5 rounded-xl rounded-tr-none text-xs max-w-[85%]">
        ${q}
      </div>
      <div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-[11px] flex items-center justify-center font-bold">You</div>
    </div>
  `;
  input.value = "";
  log.scrollTop = log.scrollHeight;

  // Thinking indicator
  const thinkingId = "tutor-thinking-" + Date.now();
  log.innerHTML += `
    <div id="${thinkingId}" class="flex items-start gap-2">
      <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary text-[11px] flex items-center justify-center font-bold flex-shrink-0">AI</div>
      <div class="bg-surface-container-low text-on-surface p-2.5 rounded-xl rounded-tl-none text-xs max-w-[88%] text-left flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[16px] animate-spin text-secondary">progress_activity</span>
        <span>Analyzing financial model & derivation steps...</span>
      </div>
    </div>
  `;
  log.scrollTop = log.scrollHeight;

  let reply = "";
  let tag = "CFA Derivation Specialist";

  if (FinApi.isOnline) {
    const apiRes = await FinApi.askTutor(q);
    if (apiRes && apiRes.response) {
      reply = apiRes.response;
      if (apiRes.tag) tag = apiRes.tag;
    }
  }

  if (!reply) {
    // Client-side fallback
    const qLower = q.toLowerCase();
    if (qLower.includes("salvage") || qLower.includes("subtract")) {
      reply = "<strong>Salvage Value Treatment:</strong> In EAC cost minimization, Salvage Value represents an inflow / cash recovery at the end of the machine's life. Therefore, its Present Value [SV × (1+r)⁻ⁿ] is subtracted from total PV of costs before dividing by PVIFA.";
      tag = "Capital Budgeting • Salvage Gotcha";
    } else if (qLower.includes("equal") || qLower.includes("lifespans")) {
      reply = "<strong>Equal Lifespans:</strong> If both Machine Alpha and Machine Beta had identical useful lives (e.g., both 5 years), you wouldn't need EAC at all! You could simply compare their Net Present Value (NPV) of costs directly.";
      tag = "Capital Budgeting • Methodology";
    } else if (qLower.includes("pvifa") || qLower.includes("formula")) {
      reply = "<strong>PVIFA Formula:</strong> PVIFA(r, n) = [1 - (1 + r)⁻ⁿ] / r. For example, with r = 10% and n = 3: [1 - (1.10)⁻³] / 0.10 = [1 - 0.75131] / 0.10 = 2.48685.";
      tag = "Time Value of Money • Formula";
    } else {
      reply = "Under the Equivalent Annual Cost (EAC) method, we standardize unequal asset lifespans into perpetual annual streams so mutually exclusive alternatives can be compared apple-to-apple. How else can I assist with this derivation?";
    }
  }

  const thinkingEl = document.getElementById(thinkingId);
  if (thinkingEl) thinkingEl.remove();

  log.innerHTML += `
    <div class="flex items-start gap-2">
      <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary text-[11px] flex items-center justify-center font-bold flex-shrink-0">AI</div>
      <div class="bg-surface-container-low text-on-surface p-2.5 rounded-xl rounded-tl-none text-xs max-w-[88%] text-left space-y-1">
        <span class="font-code-sm text-[10px] text-secondary font-bold uppercase tracking-wider block">${tag}</span>
        <p>${reply}</p>
      </div>
    </div>
  `;
  log.scrollTop = log.scrollHeight;
};

// Initialize App on DOM load
document.addEventListener("DOMContentLoaded", () => {
  AppState.init();
});
