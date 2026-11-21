"""
FinSolve - Corporate Finance & Practical Sums REST API Backend
Serves the frontend application, executes audited financial calculations,
and manages SQLite database state.
"""

import os
import random
from flask import Flask, request, jsonify, send_from_directory
import database
import calc_engine
import tutor_engine

app = Flask(__name__, static_folder=".")


# Enable CORS manually for development flexibility
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


# --- STATIC ASSETS & FRONTEND SERVING ---

@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory(".", path)
    return send_from_directory(".", "index.html")


# --- REST API: HEALTH & SYSTEM ---

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "FinSolve PRO Financial Engine",
        "version": "2.4.0",
        "curriculum": "CFA Level I & MBA Financial Management"
    })


# --- REST API: TOPICS & SYLLABUS ---

@app.route("/api/topics", methods=["GET"])
def get_topics():
    topics = database.get_all_topics()
    return jsonify({"topics": topics, "count": len(topics)})


@app.route("/api/syllabus", methods=["GET"])
def get_syllabus():
    units = [
        {"unit": 1, "name": "Time Value of Money & Annuities", "focus": "Compounding, Ordinary Annuity, Annuity Due, Perpetuity, Amortization Schedules", "marks_weight": 15},
        {"unit": 2, "name": "Capital Budgeting & Replacement", "focus": "NPV, IRR, Multiple IRRs, Profitability Index, EAC, Capital Rationing", "marks_weight": 25},
        {"unit": 3, "name": "Cost of Capital & Flotation Costs", "focus": "Component Costs (Ke, Kd, Kp), WACC, CAPM, Flotation Outlay Treatment", "marks_weight": 20},
        {"unit": 4, "name": "Capital Structure & Leverage", "focus": "Modigliani-Miller Prop I & II (Taxes), Financial & Operating Leverage", "marks_weight": 15},
        {"unit": 5, "name": "Bond Valuation & Yield Curves", "focus": "YTM Approximation, 2-Point Linear Interpolation, Duration, Convexity", "marks_weight": 15},
        {"unit": 6, "name": "Working Capital & Liquidity", "focus": "Cash Conversion Cycle, Operating Cycle, Aging Schedules, DSO, EOQ", "marks_weight": 10}
    ]
    return jsonify({"syllabus": units, "total_marks": 100})


# --- REST API: PROBLEMS ---

@app.route("/api/problems", methods=["GET"])
def get_problems():
    category = request.args.get("category", "all")
    difficulty = request.args.get("difficulty")
    search = request.args.get("search")

    problems = database.get_all_problems(category=category, difficulty=difficulty, search=search)
    return jsonify({"problems": problems, "count": len(problems)})


@app.route("/api/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    p = database.get_problem_by_id(problem_id)
    if not p:
        return jsonify({"error": f"Problem #{problem_id} not found"}), 404
    return jsonify({"problem": p})


@app.route("/api/problems/random", methods=["GET"])
def get_random_problem():
    problems = database.get_all_problems()
    if not problems:
        return jsonify({"error": "No problems found"}), 404
    chosen = random.choice(problems)
    return jsonify({"problem": chosen})


# --- REST API: FINANCIAL SOLVER ENGINES ---

@app.route("/api/solve/eac", methods=["POST"])
def solve_eac():
    """
    Solves Equivalent Annual Cost comparison between two machines.
    Accepts: { rate, asset1: { name, cost, om, life, salvage }, asset2: { ... } }
    """
    data = request.get_json() or {}
    rate = float(data.get("rate", 10.0)) / 100.0

    asset1 = data.get("asset1", {
        "name": "Alpha",
        "cost": 60000,
        "om": 8000,
        "life": 3,
        "salvage": 0
    })

    asset2 = data.get("asset2", {
        "name": "Beta",
        "cost": 85000,
        "om": 6000,
        "life": 5,
        "salvage": 5000
    })

    result = calc_engine.compare_eac(asset1, asset2, rate)
    return jsonify(result)


@app.route("/api/solve/npv", methods=["POST"])
def solve_npv():
    """
    Solves Net Present Value of uneven cash flows.
    Accepts: { initial_outlay: float, cash_flows: [float, ...], rate: float }
    """
    data = request.get_json() or {}
    initial_outlay = float(data.get("initial_outlay", 100000))
    cash_flows = data.get("cash_flows", [30000, 40000, 50000, 20000])
    rate = float(data.get("rate", 10.0)) / 100.0

    result = calc_engine.calculate_npv(initial_outlay, cash_flows, rate)
    return jsonify(result)


@app.route("/api/solve/ytm", methods=["POST"])
def solve_ytm():
    """
    Calculates bond Yield to Maturity approximation.
    """
    data = request.get_json() or {}
    coupon = float(data.get("coupon_annual", 80))
    par = float(data.get("par_value", 1000))
    price = float(data.get("market_price", 920))
    years = int(data.get("years", 10))
    semi_annual = bool(data.get("semi_annual", False))

    result = calc_engine.calculate_ytm_approx(coupon, par, price, years, semi_annual)
    return jsonify(result)


@app.route("/api/solve/wacc", methods=["POST"])
def solve_wacc():
    """
    Calculates Weighted Average Cost of Capital.
    """
    data = request.get_json() or {}
    equity_val = float(data.get("equity_value", 600000))
    ke = float(data.get("cost_of_equity", 14.0)) / 100.0
    debt_val = float(data.get("debt_value", 400000))
    kd = float(data.get("pretax_cost_of_debt", 8.0)) / 100.0
    t = float(data.get("tax_rate", 30.0)) / 100.0

    result = calc_engine.calculate_wacc(equity_val, ke, debt_val, kd, t)
    return jsonify(result)


# --- REST API: BOOKMARKS & SAVED REVISION ---

@app.route("/api/bookmarks", methods=["GET"])
def get_bookmarks():
    ids = database.get_bookmarks()
    return jsonify({"bookmarks": ids, "count": len(ids)})


@app.route("/api/bookmarks/<int:problem_id>", methods=["POST"])
def toggle_bookmark(problem_id):
    data = request.get_json() or {}
    notes = data.get("notes", "")
    is_saved = database.toggle_bookmark(problem_id, notes)
    return jsonify({
        "problem_id": problem_id,
        "is_bookmarked": is_saved,
        "message": "Saved to sheet" if is_saved else "Removed from sheet"
    })


# --- REST API: FLASHCARDS & EXAM GOTCHAS ---

@app.route("/api/flashcards", methods=["GET"])
def get_flashcards():
    cards = database.get_all_flashcards()
    return jsonify({"flashcards": cards, "count": len(cards)})


@app.route("/api/gotchas", methods=["GET"])
def get_gotchas():
    items = database.get_all_gotchas()
    return jsonify({"gotchas": items, "count": len(items)})


# --- REST API: QUIZZES & DRILLS ---

@app.route("/api/quizzes", methods=["GET"])
def get_quizzes():
    quizzes = database.get_all_quizzes()
    return jsonify({"quizzes": quizzes, "count": len(quizzes)})


@app.route("/api/quizzes/<int:quiz_id>/submit", methods=["POST"])
def submit_quiz_answer(quiz_id):
    data = request.get_json() or {}
    selected_index = data.get("selected_index")

    quizzes = database.get_all_quizzes()
    quiz = next((q for q in quizzes if q["id"] == quiz_id), None)
    if not quiz:
        return jsonify({"error": f"Quiz #{quiz_id} not found"}), 404

    is_correct = selected_index == quiz["correctIndex"]
    return jsonify({
        "quiz_id": quiz_id,
        "selected_index": selected_index,
        "correct_index": quiz["correctIndex"],
        "is_correct": is_correct,
        "explanation": quiz["explanation"]
    })


# --- REST API: AI & PEER TUTOR ---

@app.route("/api/tutor/ask", methods=["POST"])
def ask_tutor():
    data = request.get_json() or {}
    query = data.get("query", "")
    step_context = data.get("step_context", "")

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    tutor_reply = tutor_engine.generate_tutor_response(query, step_context)
    return jsonify(tutor_reply)


# --- ENTRYPOINT ---

def main():
    database.init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"\n==================================================")
    print(f"🚀 FinSolve PRO Backend Server Running!")
    print(f"📍 Local Web App: http://127.0.0.1:{port}")
    print(f"📡 API Health:    http://127.0.0.1:{port}/api/health")
    print(f"💽 Database:      SQLite (finsolve.db initialized)")
    print(f"==================================================\n")
    app.run(host="0.0.0.0", port=port, debug=False)


if __name__ == "__main__":
    main()
