# FinSolve PRO - Fullstack Financial Management & Practical Sums Engine

FinSolve PRO is a CFA Level I and MBA-targeted practical corporate finance sums platform featuring interactive problem-solving, audited calculation derivations, spaced repetition drills, and an intelligent financial tutor.

---

## Architecture Overview

```text
Sample/
├── index.html           # Frontend SPA shell (Topics, Problems, Solver, Practice, Saved)
├── app.js               # Frontend controller, state manager, and FinApi client
├── styles.css           # Custom theme typography, 3D flip-card styles & print layouts
├── server.py            # Python Flask REST API backend & static file server
├── database.py          # SQLite database schema, migrations & seed repository (finsolve.db)
├── calc_engine.py       # Audited financial calculation engine (EAC, NPV, YTM, WACC, PVIFA)
├── tutor_engine.py      # Pedagogical AI tutor analyzing steps, formulas & examiner traps
└── requirements.txt     # Python dependencies (Flask)
```

---

## Getting Started

### 1. Start the Backend Server
Run the Flask backend server from the project directory:

```powershell
python server.py
```

The server automatically initializes the SQLite database (`finsolve.db`), seeds the curriculum data, and starts hosting both the REST API and the frontend at:

- **Web Application:** [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **API Health Endpoint:** [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)

### 2. Standalone / Offline Mode
The frontend is built **offline-first**: you can also simply double-click and open `index.html` directly in your browser. When `server.py` is running, the top bar displays **"Backend Live (SQLite)"** and seamlessly synchronizes calculations and bookmarks with the database.

---

## REST API Reference

### Topics & Syllabus
- `GET /api/topics` — List all 6 financial curriculum units with completion stats.
- `GET /api/syllabus` — Full MBA / CFA syllabus map with exam mark weightages.

### Problems & Derivations
- `GET /api/problems` — Filterable by `category`, `difficulty`, and `search`.
- `GET /api/problems/<id>` — Full problem statement, parameters, and formula data.
- `GET /api/problems/random` — Picks a random problem with full parameters.

### Financial Calculation Engines
- `POST /api/solve/eac` — Computes Equivalent Annual Cost comparison between two machines, including $PVIFA$, Net PV, salvage deduction, and a 5-step derivation trace.
  ```json
  {
    "rate": 10.0,
    "asset1": { "name": "Alpha", "cost": 60000, "om": 8000, "life": 3, "salvage": 0 },
    "asset2": { "name": "Beta", "cost": 85000, "om": 6000, "life": 5, "salvage": 5000 }
  }
  ```
- `POST /api/solve/npv` — Net Present Value of uneven cash flow streams and Profitability Index.
- `POST /api/solve/ytm` — Bond Yield to Maturity approximation and frequency adjustment.
- `POST /api/solve/wacc` — Weighted Average Cost of Capital with flotation cost guidance.

### Bookmarks & Saved Notebook
- `GET /api/bookmarks` — Returns all saved problem IDs from SQLite.
- `POST /api/bookmarks/<id>` — Toggles bookmark status with optional user revision notes.

### Interactive Quizzes & Flashcards
- `GET /api/quizzes` — CFA/MBA calculation question bank.
- `POST /api/quizzes/<id>/submit` — Submits option choice and returns step-by-step mathematical explanation.
- `GET /api/flashcards` — Core valuation formula flashcards with assumptions and traps.
- `GET /api/gotchas` — Top 5 examiner traps with statistical mistake rates.

### Pedagogical AI Tutor
- `POST /api/tutor/ask` — Context-aware AI tutor answering queries on derivation steps, salvage values, equal vs unequal lives, and formula derivations.
  ```json
  { "query": "Why do we subtract salvage value in EAC?" }
  ```
