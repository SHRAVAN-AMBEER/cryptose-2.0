import sys
import os

# Ensure the parent directory (e:\cryptose) is in the python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from mcp.server.fastmcp import FastMCP
from typing import Dict, Any

# Import our modular tools
from .market import (
    get_live_price,
    get_market_cap,
    get_volume,
    get_24h_change
)
from .ta import (
    calculate_rsi,
    calculate_sma,
    calculate_ema,
    calculate_macd
)
from .risk import (
    calculate_volatility,
    calculate_sharpe_ratio,
    calculate_concentration_risk
)

# Initialize the FastMCP Server
mcp = FastMCP("cryptose-tools", port=8000)

# ==========================================
# Market Tools
# ==========================================
@mcp.tool()
def live_price(symbol: str) -> float:
    """Get the current live price in USD for a cryptocurrency symbol (e.g. bitcoin)."""
    return get_live_price(symbol)

@mcp.tool()
def market_cap(symbol: str) -> float:
    """Get the market capitalization in USD for a cryptocurrency."""
    return get_market_cap(symbol)

@mcp.tool()
def volume_24h(symbol: str) -> float:
    """Get the 24h trading volume in USD for a cryptocurrency."""
    return get_volume(symbol)

@mcp.tool()
def price_change_24h(symbol: str) -> float:
    """Get the 24h price change percentage for a cryptocurrency."""
    return get_24h_change(symbol)

# ==========================================
# Technical Analysis Tools
# ==========================================
@mcp.tool()
def ta_rsi(symbol: str, timeframe: int = 14) -> float:
    """Calculate Relative Strength Index (RSI) for a given symbol."""
    return calculate_rsi(symbol, timeframe)

@mcp.tool()
def ta_sma(symbol: str, window: int = 20) -> float:
    """Calculate Simple Moving Average (SMA) for a given symbol."""
    return calculate_sma(symbol, window)

@mcp.tool()
def ta_ema(symbol: str, window: int = 20) -> float:
    """Calculate Exponential Moving Average (EMA) for a given symbol."""
    return calculate_ema(symbol, window)

@mcp.tool()
def ta_macd(symbol: str) -> dict:
    """Calculate MACD (Moving Average Convergence Divergence) for a given symbol."""
    return calculate_macd(symbol)

# ==========================================
# Risk Tools
# ==========================================
@mcp.tool()
def portfolio_volatility(portfolio: Dict[str, float]) -> float:
    """
    Calculate annualized volatility of a portfolio.
    portfolio should be a dict of {symbol: weight} e.g. {"bitcoin": 0.6, "ethereum": 0.4}
    """
    return calculate_volatility(portfolio)

@mcp.tool()
def portfolio_sharpe_ratio(portfolio: Dict[str, float], risk_free_rate: float = 0.02) -> float:
    """Calculate annualized Sharpe Ratio for a portfolio."""
    return calculate_sharpe_ratio(portfolio, risk_free_rate)

@mcp.tool()
def portfolio_concentration_risk(portfolio: Dict[str, float]) -> dict:
    """Calculate the Herfindahl-Hirschman Index (HHI) for concentration risk."""
    return calculate_concentration_risk(portfolio)

if __name__ == "__main__":
    # Run the FastMCP server via SSE on port 8000
    mcp.run(transport='sse')
