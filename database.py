"""
FinSolve - SQLite Database & Persistence Layer
Initializes the database schema and seeds master MBA/CFA financial datasets.
"""

import sqlite3
import json
from typing import Dict, Any, List, Optional

DB_FILE = "finsolve.db"


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Topics Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL,
        total INTEGER NOT NULL,
        icon TEXT NOT NULL,
        tags TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Problems Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        short_title TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        difficulty_label TEXT NOT NULL,
        topic TEXT NOT NULL,
        badge TEXT NOT NULL,
        badge_icon TEXT NOT NULL,
        badge_class TEXT NOT NULL,
        description TEXT NOT NULL,
        formula TEXT NOT NULL,
        k_label TEXT NOT NULL,
        time_est TEXT NOT NULL,
        steps_count TEXT NOT NULL,
        progress TEXT NOT NULL,
        solved INTEGER NOT NULL,
        params_json TEXT
    );
    """)

    # Bookmarks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookmarks (
        problem_id INTEGER PRIMARY KEY,
        notes TEXT,
        priority INTEGER DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (problem_id) REFERENCES problems(id)
    );
    """)

    # Quizzes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        question TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_index INTEGER NOT NULL,
        explanation TEXT NOT NULL
    );
    """)

    # Flashcards Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS flashcards (
        id TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        name TEXT NOT NULL,
        formula TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        tag TEXT NOT NULL,
        back_title TEXT NOT NULL,
        back_content TEXT NOT NULL
    );
    """)

    # Exam Gotchas Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS gotchas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        topic TEXT NOT NULL,
        severity TEXT NOT NULL,
        summary TEXT NOT NULL,
        formula TEXT NOT NULL,
        stat TEXT NOT NULL
    );
    """)

    conn.commit()
    seed_initial_data(conn)
    conn.close()


def seed_initial_data(conn):
    cursor = conn.cursor()

    # Check if topics exist
    cursor.execute("SELECT COUNT(*) as count FROM topics")
    if cursor.fetchone()["count"] == 0:
        topics_data = [
            ("tvm", "Time Value of Money & Annuities", 18, 24, "hourglass_top", json.dumps(["PV", "FV", "PMT", "EAR"]), "completed"),
            ("capital-budgeting", "Capital Budgeting & Cash Flows", 8, 22, "account_balance", json.dumps(["NPV", "IRR", "PI", "Payback"]), "in-progress"),
            ("cost-of-capital", "Cost of Capital & WACC", 6, 16, "pie_chart", json.dumps(["Ke", "Kd", "WACC", "CAPM"]), "in-progress"),
            ("bond-valuation", "Bond Valuation & Yield to Maturity", 4, 15, "show_chart", json.dumps(["YTM", "Duration", "Convexity"]), "in-progress"),
            ("working-capital", "Working Capital Management", 3, 18, "sync_alt", json.dumps(["CCC", "DSO", "Inventory Cycle"]), "in-progress"),
            ("ratio-analysis", "Financial Ratio Analysis & DuPont", 3, 15, "analytics", json.dumps(["ROE", "ROA", "Quick Ratio"]), "in-progress")
        ]
        cursor.executemany("INSERT INTO topics VALUES (?, ?, ?, ?, ?, ?, ?)", topics_data)

    # Check if problems exist
    cursor.execute("SELECT COUNT(*) as count FROM problems")
    if cursor.fetchone()["count"] == 0:
        problems_data = [
            (
                23,
                "Problem #23: Mutually Exclusive Projects with Unequal Lives (EAC Method)",
                "EAC Method with Salvage Value",
                "replacement",
                "advanced",
                "Advanced",
                "Capital Budgeting",
                "Exam Hotspot",
                "star",
                "bg-tertiary-fixed text-on-tertiary-fixed",
                "Project A has 3-year life ($60,000 cost), Project B has 5-year life ($85,000 cost). Discount rate 10%. Calculate Equivalent Annual Cost.",
                "EAC = NPV / PVIFA(k,n)",
                "k=10%",
                "14m",
                "4 Steps",
                "100% Solved",
                1,
                json.dumps({
                    "r": 0.10,
                    "m1": {"name": "Alpha", "cost": 60000, "om": 8000, "life": 3, "salvage": 0},
                    "m2": {"name": "Beta", "cost": 85000, "om": 6000, "life": 5, "salvage": 5000}
                })
            ),
            (
                24,
                "Problem #24: Project with Non-Conventional Cash Flows (Multiple IRRs)",
                "Non-Conventional Flows & Descartes Rule",
                "npv",
                "advanced",
                "Advanced",
                "Capital Budgeting",
                "Tricky Concept",
                "bolt",
                "bg-error-container text-on-error-container",
                "Initial outlay $100k, Year 1 inflow $230k, Year 2 outflow $132k. Determine real cost and explain Descartes sign rule.",
                "0 = -CF₀ + CF₁/(1+r) - CF₂/(1+r)²",
                "k=12%",
                "18m",
                "Descartes Rule",
                "In Progress (Step 3/5)",
                0,
                None
            ),
            (
                25,
                "Problem #25: Comprehensive Capital Rationing with Divisible vs Indivisible",
                "Capital Rationing & PI Optimization",
                "payback",
                "exam",
                "Exam Level",
                "Capital Budgeting",
                "Univ Past Paper '23",
                "school",
                "bg-surface-container-high text-on-surface-variant",
                "Company budget constraint $500,000 across 5 capital projects. Select optimal combination using Profitability Index ranking.",
                "PI = PV of Future Cashflows / Initial Outlay",
                "Budget: $500k",
                "22m",
                "5 Projects",
                "Unsolved",
                0,
                None
            ),
            (
                26,
                "Problem #26: Tax Shield on Accelerated Depreciation & Salvage Value Treatment",
                "MACRS Tax Shield & Capital Gain Tax",
                "replacement",
                "basic",
                "Basic",
                "Capital Budgeting",
                "Core Fundamental",
                "verified",
                "bg-surface-container-high text-on-surface-variant",
                "Calculate annual CFAT under MACRS 3-year property class with 30% marginal tax rate and terminal book salvage difference.",
                "Tax Shield = Depreciation × Tax Rate (T)",
                "T=30%",
                "10m",
                "MACRS",
                "Unsolved",
                0,
                None
            ),
            (
                19,
                "Problem #19: Uneven Cash Flow NPV with 12% Cost of Capital",
                "Uneven Cash Flow Discounting",
                "npv",
                "exam",
                "Exam Level",
                "Capital Budgeting",
                "High Exam Frequency",
                "priority_high",
                "bg-error-container text-on-error-container",
                "Evaluate 5-year erratic cash inflows ($20k, $45k, $30k, $60k, $15k) against $110,000 upfront outlay at 12% hurdle rate.",
                "∑ CFₜ/(1+k)ᵗ - I₀",
                "k=12%",
                "12m",
                "4 Steps",
                "In Review",
                0,
                None
            ),
            (
                8,
                "Problem #08: Bond YTM Approximation vs Interpolation",
                "YTM Approximation vs Interpolation",
                "bonds",
                "exam",
                "Exam Level",
                "Fixed Income",
                "CFA Core",
                "school",
                "bg-surface-container-high text-on-surface-variant",
                "A 10-year 8% coupon bond with $1,000 par value is selling for $920. Calculate Yield to Maturity using approximation and 2-point interpolation.",
                "[C + (F - P)/n] / [(F + 2P)/3]",
                "Par: $1k",
                "16m",
                "Interpolation",
                "Saved",
                1,
                None
            ),
            (
                42,
                "Problem #42: Flotation Costs Adjustment in WACC",
                "Flotation Costs Adjustment in WACC",
                "wacc",
                "exam",
                "Exam Level",
                "Cost of Capital",
                "Examiner Trap",
                "warning",
                "bg-tertiary-fixed text-on-tertiary-fixed",
                "Company plans $10M new equity issue with 5% flotation costs. Correct treatment in NPV project appraisal vs cost of equity adjustments.",
                "Initial Cash Outlay = Cost / (1 - f)",
                "f=5%",
                "15m",
                "WACC Trap",
                "Saved",
                1,
                None
            )
        ]
        cursor.executemany("INSERT INTO problems VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", problems_data)

    # Initial Seed for Bookmarks
    cursor.execute("SELECT COUNT(*) as count FROM bookmarks")
    if cursor.fetchone()["count"] == 0:
        cursor.executemany("INSERT INTO bookmarks (problem_id, notes, priority) VALUES (?, ?, ?)", [
            (23, "Remember: Deduct PV of salvage value before dividing by PVIFA!", 3),
            (8, "Semi-annual coupon dividing C by 2 and multiplying n by 2.", 2),
            (42, "Prof. Miller: Adjust flotation in initial cash outlay at t=0, NOT in Ke!", 3)
        ])

    # Quizzes
    cursor.execute("SELECT COUNT(*) as count FROM quizzes")
    if cursor.fetchone()["count"] == 0:
        quizzes_data = [
            (
                1,
                "Capital Budgeting: EAC Quick Check",
                "A machine costs $50,000, has annual operating costs of $5,000, and lasts 4 years with no salvage value. If the cost of capital is 10% (PVIFA = 3.1699), what is the Equivalent Annual Cost (EAC)?",
                json.dumps(["$15,773 / yr", "$20,773 / yr", "$12,500 / yr", "$18,250 / yr"]),
                1,
                "Total PV of Costs = $50,000 + ($5,000 × 3.1699) = $50,000 + $15,849.50 = $65,849.50. EAC = $65,849.50 ÷ 3.1699 = $20,773.37 / yr (or Outlay/PVIFA + Annual OM = 50000/3.1699 + 5000 = $15,773.37 + $5,000 = $20,773.37 / yr)."
            ),
            (
                2,
                "Gordon Growth Valuation",
                "Zenith Ltd paid a dividend of $4.00 yesterday. Dividends are expected to grow at 6% perpetually. If the required return on equity is 14%, what is the intrinsic value of the share today?",
                json.dumps(["$50.00", "$53.00", "$48.50", "$57.24"]),
                1,
                "Given D₀ = $4.00, D₁ = $4.00 × (1 + 0.06) = $4.24. Intrinsic Price P₀ = D₁ / (Ke - g) = $4.24 / (0.14 - 0.06) = $4.24 / 0.08 = $53.00."
            ),
            (
                3,
                "Tax Shield on Depreciation",
                "A firm buys equipment for $120,000 depreciated straight-line over 3 years to zero salvage. The marginal tax rate is 35%. What is the annual depreciation tax shield?",
                json.dumps(["$40,000", "$26,000", "$14,000", "$28,000"]),
                2,
                "Annual Depreciation = $120,000 / 3 = $40,000/yr. Depreciation Tax Shield = Depreciation × Tax Rate = $40,000 × 0.35 = $14,000 cash flow savings per year."
            )
        ]
        cursor.executemany("INSERT INTO quizzes VALUES (?, ?, ?, ?, ?, ?)", quizzes_data)

    # Flashcards
    cursor.execute("SELECT COUNT(*) as count FROM flashcards")
    if cursor.fetchone()["count"] == 0:
        flashcards_data = [
            ("fc1", "EQUITY VALUATION", "Gordon Growth Model", "P₀ = D₁ / (Kₑ - g)", "D₁ = D₀ × (1 + g)", "CFA Level I Core", "Assumptions & Sensitivity", "Applies only when Kₑ > g and growth is perpetual. If Ke approaches g, price approaches infinity. Flotation costs should adjust net issue price P₀(1-f)."),
            ("fc2", "CAPITAL STRUCTURE", "M&M Proposition II (Taxes)", "rₑ = r₀ + (r₀ - r_d)(1 - T)(D / E)", "Tax Shield Benefit", "High Trap Rate", "Cost of Levered Equity", "Cost of equity increases linearly with debt-to-equity ratio, mitigated by the tax shield (1 - T). Firm value VL = VU + (T × D)."),
            ("fc3", "COST OF CAPITAL", "Weighted Average Cost (WACC)", "WACC = (E/V)Kₑ + (D/V)K_d(1-T) + (P/V)K_p", "Target Market Weights", "Every Exam", "Weighting Rules", "Always use target market value weights, not historical book values. Interest is tax-deductible; preferred stock and common equity dividends are not."),
            ("fc4", "FIXED INCOME", "Bond YTM Approximation", "YTM ≈ [C + (F - P)/n] ÷ [(F + P)/2]", "Semi-annual: C/2, 2n", "Formula Trap", "Alternative 1/3 Weighting", "Some Indian & UK universities use denominator (F + 2P)/3 for improved accuracy on discount bonds. Check syllabus preference!")
        ]
        cursor.executemany("INSERT INTO flashcards VALUES (?, ?, ?, ?, ?, ?, ?, ?)", flashcards_data)

    # Gotchas
    cursor.execute("SELECT COUNT(*) as count FROM gotchas")
    if cursor.fetchone()["count"] == 0:
        gotchas_data = [
            ("Terminal Value Multi-Stage Timing Trap", "DCF Valuation", "High", "In a 5-year explicit forecast, the numerator for Terminal Value is CF₆ = CF₅ × (1 + g), NOT CF₅ alone. Furthermore, the calculated TV resides at t = 5 and MUST be discounted back to t = 0 by (1 + r)⁵.", "TV₅ = CF₅(1 + g) / (WACC - g)", "73% of candidates miss the g-step in speed tests"),
            ("Salvage Value Sign in Equivalent Annual Cost (EAC)", "Capital Budgeting", "Critical", "When evaluating replacement options using EAC cost minimization, Salvage Value represents an inflow / cost recovery. It MUST be subtracted from total PV of costs BEFORE dividing by PVIFA.", "Net PV Costs = Outlay + PV(O&M) - PV(Salvage)", "58% add salvage instead of deducting"),
            ("Flotation Costs: WACC Adjustment vs Initial Outlay", "Cost of Capital", "High", "Flotation costs are an immediate upfront cash expense. Adjusting WACC upward by flotation costs artificially penalizes longer-lived projects perpetually. The correct CFA standard is adding flotation costs to Initial Cash Outlay at t = 0.", "True Outlay = Project Cost / (1 - Flotation Rate)", "Frequent university trick question"),
            ("Non-Conventional Cash Flows & Multiple IRRs", "Capital Budgeting", "Medium", "If a project has multiple cash flow sign changes (+ / - / +), Descartes' Rule of Signs implies multiple internal rates of return may exist. In such cases, IRR becomes mathematically invalid; rely strictly on NPV or MIRR.", "Use NPV Profile or MIRR", "Examiner hotspot for theoretical commentary"),
            ("Semi-Annual Coupon Frequency Adjustments", "Bond Valuation", "High", "When bond coupons are paid semi-annually: Coupon C is divided by 2, number of periods n is multiplied by 2, and the discount yield per period is r/2. Forgetting to double n is the #1 math slip.", "Periodic Coupon = C / 2, Periods = 2 × n", "64% make period index error under exam timing")
        ]
        cursor.executemany("INSERT INTO gotchas (title, topic, severity, summary, formula, stat) VALUES (?, ?, ?, ?, ?, ?)", gotchas_data)

    conn.commit()


# --- DATABASE QUERY HELPERS ---

def get_all_topics() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM topics").fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "completed": r["completed"],
            "total": r["total"],
            "icon": r["icon"],
            "tags": json.loads(r["tags"]),
            "status": r["status"]
        })
    return result


def get_all_problems(category: Optional[str] = None, difficulty: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    query = "SELECT * FROM problems WHERE 1=1"
    params = []

    if category and category != "all":
        query += " AND category = ?"
        params.append(category)

    if difficulty:
        query += " AND difficulty = ?"
        params.append(difficulty)

    if search:
        query += " AND (title LIKE ? OR description LIKE ? OR formula LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s])

    rows = conn.execute(query, params).fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "shortTitle": r["short_title"],
            "category": r["category"],
            "difficulty": r["difficulty"],
            "difficultyLabel": r["difficulty_label"],
            "topic": r["topic"],
            "badge": r["badge"],
            "badgeIcon": r["badge_icon"],
            "badgeClass": r["badge_class"],
            "description": r["description"],
            "formula": r["formula"],
            "k": r["k_label"],
            "time": r["time_est"],
            "steps": r["steps_count"],
            "progress": r["progress"],
            "solved": bool(r["solved"]),
            "data": json.loads(r["params_json"]) if r["params_json"] else None
        })
    return result


def get_problem_by_id(problem_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    r = conn.execute("SELECT * FROM problems WHERE id = ?", (problem_id,)).fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "title": r["title"],
        "shortTitle": r["short_title"],
        "category": r["category"],
        "difficulty": r["difficulty"],
        "difficultyLabel": r["difficulty_label"],
        "topic": r["topic"],
        "badge": r["badge"],
        "badgeIcon": r["badge_icon"],
        "badgeClass": r["badge_class"],
        "description": r["description"],
        "formula": r["formula"],
        "k": r["k_label"],
        "time": r["time_est"],
        "steps": r["steps_count"],
        "progress": r["progress"],
        "solved": bool(r["solved"]),
        "data": json.loads(r["params_json"]) if r["params_json"] else None
    }


def get_bookmarks() -> List[int]:
    conn = get_db_connection()
    rows = conn.execute("SELECT problem_id FROM bookmarks").fetchall()
    conn.close()
    return [r["problem_id"] for r in rows]


def toggle_bookmark(problem_id: int, notes: str = "") -> bool:
    conn = get_db_connection()
    existing = conn.execute("SELECT 1 FROM bookmarks WHERE problem_id = ?", (problem_id,)).fetchone()
    if existing:
        conn.execute("DELETE FROM bookmarks WHERE problem_id = ?", (problem_id,))
        is_bookmarked = False
    else:
        conn.execute("INSERT INTO bookmarks (problem_id, notes) VALUES (?, ?)", (problem_id, notes))
        is_bookmarked = True
    conn.commit()
    conn.close()
    return is_bookmarked


def get_all_quizzes() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM quizzes").fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "title": r["title"],
        "question": r["question"],
        "options": json.loads(r["options_json"]),
        "correctIndex": r["correct_index"],
        "explanation": r["explanation"]
    } for r in rows]


def get_all_flashcards() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM flashcards").fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "domain": r["domain"],
        "name": r["name"],
        "formula": r["formula"],
        "subtitle": r["subtitle"],
        "tag": r["tag"],
        "backTitle": r["back_title"],
        "backContent": r["back_content"]
    } for r in rows]


def get_all_gotchas() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM gotchas").fetchall()
    conn.close()
    return [{
        "id": r["id"],
        "title": r["title"],
        "topic": r["topic"],
        "severity": r["severity"],
        "summary": r["summary"],
        "formula": r["formula"],
        "stat": r["stat"]
    } for r in rows]
