import numpy as np
import pandas as pd
from typing import Dict
from .ta import _get_historical_prices

def _get_portfolio_returns(portfolio: Dict[str, float], days: int = 90) -> pd.Series:
    """Calculate daily returns of a portfolio given symbols and their weights."""
    returns_df = pd.DataFrame()
    for symbol, weight in portfolio.items():
        prices = _get_historical_prices(symbol, days=days)
        # Calculate daily percentage change
        returns = prices.pct_change().dropna()
        returns_df[symbol] = returns * weight
    
    # Sum the weighted returns for each day
    portfolio_returns = returns_df.sum(axis=1)
    return portfolio_returns

def calculate_volatility(portfolio: Dict[str, float]) -> float:
    """
    Calculate annualized volatility of a portfolio.
    portfolio should be a dict of {symbol: weight} e.g. {"bitcoin": 0.6, "ethereum": 0.4}
    """
    daily_returns = _get_portfolio_returns(portfolio)
    # Annualized volatility = daily standard deviation * sqrt(365) for crypto
    volatility = np.std(daily_returns) * np.sqrt(365)
    return float(volatility)

def calculate_sharpe_ratio(portfolio: Dict[str, float], risk_free_rate: float = 0.02) -> float:
    """
    Calculate annualized Sharpe Ratio.
    """
    daily_returns = _get_portfolio_returns(portfolio)
    annualized_return = np.mean(daily_returns) * 365
    volatility = calculate_volatility(portfolio)
    
    if volatility == 0:
        return 0.0
        
    sharpe_ratio = (annualized_return - risk_free_rate) / volatility
    return float(sharpe_ratio)

def calculate_concentration_risk(portfolio: Dict[str, float]) -> dict:
    """
    Calculate the Herfindahl-Hirschman Index (HHI) for concentration risk.
    Higher values mean more concentrated (riskier). Max is 10000 (100% in one asset).
    """
    hhi = 0
    for weight in portfolio.values():
        hhi += (weight * 100) ** 2
        
    risk_level = "Low"
    if hhi > 2500:
        risk_level = "High"
    elif hhi > 1500:
        risk_level = "Medium"
        
    return {
        "hhi_index": float(hhi),
        "risk_level": risk_level
    }
