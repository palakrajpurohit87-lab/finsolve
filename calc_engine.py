"""
FinSolve - Core Financial Calculation Engine
Provides CFA / MBA grade practical financial computations and step-by-step derivation generators.
"""

import math
from typing import Dict, Any, List, Tuple


def calculate_pvifa(rate: float, periods: int) -> float:
    """
    Present Value Interest Factor of an Annuity:
    PVIFA(r, n) = [1 - (1 + r)^(-n)] / r
    """
    if rate == 0:
        return float(periods)
    return (1.0 - math.pow(1.0 + rate, -periods)) / rate


def calculate_pv(future_value: float, rate: float, periods: int) -> float:
    """
    Present value of a single future cash flow:
    PV = FV / (1 + r)^n
    """
    return future_value / math.pow(1.0 + rate, periods)


def calculate_eac(
    cost: float,
    annual_om: float,
    useful_life: int,
    salvage_value: float,
    rate: float,
    asset_name: str = "Asset"
) -> Dict[str, Any]:
    """
    Equivalent Annual Cost (EAC) for Capital Budgeting Replacement:
    1. PVIFA(r, n)
    2. PV(O&M) = annual_om * PVIFA
    3. PV(Salvage) = salvage_value / (1 + r)^n
    4. Net PV = cost + PV(O&M) - PV(Salvage)
    5. EAC = Net PV / PVIFA
    """
    pvifa_factor = calculate_pvifa(rate, useful_life)
    pv_om = annual_om * pvifa_factor
    pv_salvage = calculate_pv(salvage_value, rate, useful_life)
    net_pv = cost + pv_om - pv_salvage
    eac = net_pv / pvifa_factor if pvifa_factor > 0 else 0.0

    return {
        "name": asset_name,
        "cost": cost,
        "annual_om": annual_om,
        "useful_life": useful_life,
        "salvage_value": salvage_value,
        "rate": rate,
        "pvifa": round(pvifa_factor, 5),
        "pv_om": round(pv_om, 2),
        "pv_salvage": round(pv_salvage, 2),
        "net_pv": round(net_pv, 2),
        "eac": round(eac, 2)
    }


def compare_eac(asset1: Dict[str, Any], asset2: Dict[str, Any], rate: float) -> Dict[str, Any]:
    """
    Compares two mutually exclusive assets with unequal lives using the EAC method.
    Generates a full 5-step derivation trace and verdict.
    """
    res1 = calculate_eac(
        cost=float(asset1.get("cost", 0)),
        annual_om=float(asset1.get("om", 0)),
        useful_life=int(asset1.get("life", 1)),
        salvage_value=float(asset1.get("salvage", 0)),
        rate=rate,
        asset_name=asset1.get("name", "Machine 1")
    )

    res2 = calculate_eac(
        cost=float(asset2.get("cost", 0)),
        annual_om=float(asset2.get("om", 0)),
        useful_life=int(asset2.get("life", 1)),
        salvage_value=float(asset2.get("salvage", 0)),
        rate=rate,
        asset_name=asset2.get("name", "Machine 2")
    )

    diff = abs(res1["eac"] - res2["eac"])
    optimal = res1 if res1["eac"] < res2["eac"] else res2
    suboptimal = res2 if res1["eac"] < res2["eac"] else res1

    rate_pct = round(rate * 100, 2)

    # 5-step derivation trace
    trace = [
        {
            "step": 1,
            "title": "Annuity Factor Determination",
            "description": f"PVIFA({rate_pct}%, {res1['useful_life']} yrs) = {res1['pvifa']} and PVIFA({rate_pct}%, {res2['useful_life']} yrs) = {res2['pvifa']}.",
            "verified": True
        },
        {
            "step": 2,
            "title": f"Present Value of Total Costs ({res1['name']})",
            "description": f"PV = Outlay (${res1['cost']:,.2f}) + (${res1['annual_om']:,.2f} × {res1['pvifa']}) - PV(Salvage: ${res1['pv_salvage']:,.2f}) = ${res1['net_pv']:,.2f}.",
            "verified": True
        },
        {
            "step": 3,
            "title": f"Present Value of Total Costs ({res2['name']})",
            "description": f"PV = Outlay (${res2['cost']:,.2f}) + (${res2['annual_om']:,.2f} × {res2['pvifa']}) - PV(Salvage: ${res2['pv_salvage']:,.2f}) = ${res2['net_pv']:,.2f}.",
            "verified": True
        },
        {
            "step": 4,
            "title": "Equivalent Annual Cost (EAC) Conversion",
            "description": f"{res1['name']} EAC = ${res1['net_pv']:,.2f} ÷ {res1['pvifa']} = ${res1['eac']:,.2f}/yr. {res2['name']} EAC = ${res2['net_pv']:,.2f} ÷ {res2['pvifa']} = ${res2['eac']:,.2f}/yr.",
            "verified": True
        },
        {
            "step": 5,
            "title": "Executive Decision Verdict",
            "description": f"Select Machine {optimal['name']}. Annualized economic savings: ${diff:,.2f}/yr compared to {suboptimal['name']}.",
            "verified": True
        }
    ]

    return {
        "rate": rate,
        "asset1": res1,
        "asset2": res2,
        "optimal_asset": optimal["name"],
        "annual_savings": round(diff, 2),
        "trace": trace
    }


def calculate_npv(initial_outlay: float, cash_flows: List[float], rate: float) -> Dict[str, Any]:
    """
    Net Present Value of uneven cash flows:
    NPV = -I_0 + sum(CF_t / (1 + r)^t)
    """
    discounted_flows = []
    pv_inflows = 0.0

    for t, cf in enumerate(cash_flows, start=1):
        df = cf / math.pow(1.0 + rate, t)
        discounted_flows.append({
            "year": t,
            "cash_flow": cf,
            "discount_factor": round(1.0 / math.pow(1.0 + rate, t), 5),
            "pv": round(df, 2)
        })
        pv_inflows += df

    npv = -initial_outlay + pv_inflows
    pi = pv_inflows / initial_outlay if initial_outlay > 0 else 0.0

    return {
        "initial_outlay": initial_outlay,
        "rate": rate,
        "pv_inflows": round(pv_inflows, 2),
        "npv": round(npv, 2),
        "profitability_index": round(pi, 4),
        "decision": "Accept" if npv > 0 else "Reject",
        "flows": discounted_flows
    }


def calculate_ytm_approx(
    coupon_annual: float,
    par_value: float,
    market_price: float,
    years_to_maturity: int,
    semi_annual: bool = False
) -> Dict[str, Any]:
    """
    Bond Yield to Maturity (Approximation Method):
    YTM ≈ [ C + (F - P)/n ] / [ (F + P)/2 ]
    """
    n = years_to_maturity * 2 if semi_annual else years_to_maturity
    c = coupon_annual / 2.0 if semi_annual else coupon_annual

    numerator = c + (par_value - market_price) / n
    denominator = (par_value + market_price) / 2.0
    periodic_ytm = numerator / denominator if denominator > 0 else 0.0
    annual_ytm = periodic_ytm * 2.0 if semi_annual else periodic_ytm

    return {
        "par_value": par_value,
        "market_price": market_price,
        "coupon_annual": coupon_annual,
        "years": years_to_maturity,
        "semi_annual": semi_annual,
        "periodic_ytm": round(periodic_ytm * 100, 3),
        "annualized_ytm": round(annual_ytm * 100, 3),
        "formula": "[C + (F - P)/n] / [(F + P)/2]"
    }


def calculate_wacc(
    equity_value: float,
    cost_of_equity: float,
    debt_value: float,
    pretax_cost_of_debt: float,
    tax_rate: float,
    preferred_value: float = 0.0,
    cost_of_preferred: float = 0.0,
    flotation_rate: float = 0.0
) -> Dict[str, Any]:
    """
    Weighted Average Cost of Capital (WACC):
    WACC = (E/V)*Ke + (D/V)*Kd*(1 - T) + (P/V)*Kp
    """
    total_val = equity_value + debt_value + preferred_value
    if total_val == 0:
        return {"wacc": 0.0}

    w_e = equity_value / total_val
    w_d = debt_value / total_val
    w_p = preferred_value / total_val

    after_tax_kd = pretax_cost_of_debt * (1.0 - tax_rate)
    wacc = (w_e * cost_of_equity) + (w_d * after_tax_kd) + (w_p * cost_of_preferred)

    return {
        "equity_weight": round(w_e, 4),
        "debt_weight": round(w_d, 4),
        "preferred_weight": round(w_p, 4),
        "after_tax_cost_of_debt": round(after_tax_kd * 100, 2),
        "wacc": round(wacc * 100, 3),
        "flotation_advisory": "CFA Standard: Adjust Initial Outlay at t=0 by Outlay/(1-f), do not inflate WACC."
    }
