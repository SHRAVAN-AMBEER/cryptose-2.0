import requests
import pandas as pd
import ta
import numpy as np
import json
from .cache import with_cache

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

@with_cache(3600)
def _get_historical_prices(symbol: str, days: int = 30) -> pd.Series:
    """Fetch historical prices from CoinGecko and return a Pandas Series."""
    url = f"{COINGECKO_BASE}/coins/{symbol.lower()}/market_chart?vs_currency=usd&days={days}"
    response = requests.get(url)
    data = response.json()
    if 'prices' not in data:
        # Fallback to handle json string deserialization if retrieved from Redis
        if isinstance(data, str):
            try:
                # the cache utility serializes Series to json string
                return pd.read_json(data, typ='series')
            except Exception:
                pass
        raise ValueError(f"Could not fetch historical data for {symbol}")
    
    # prices is a list of [timestamp, price]
    df = pd.DataFrame(data['prices'], columns=['timestamp', 'price'])
    return df['price']

def calculate_rsi(symbol: str, timeframe: int = 14) -> float:
    """Calculate Relative Strength Index (RSI) for a given symbol and timeframe."""
    prices = _get_historical_prices(symbol, days=max(30, timeframe * 2))
    rsi_series = ta.momentum.RSIIndicator(close=prices, window=timeframe).rsi()
    # Return the most recent RSI value (ignoring NaNs from the start)
    return float(rsi_series.dropna().iloc[-1])

def calculate_sma(symbol: str, window: int = 20) -> float:
    """Calculate Simple Moving Average (SMA) for a given symbol."""
    prices = _get_historical_prices(symbol, days=max(30, window * 2))
    sma_series = ta.trend.SMAIndicator(close=prices, window=window).sma_indicator()
    return float(sma_series.dropna().iloc[-1])

def calculate_ema(symbol: str, window: int = 20) -> float:
    """Calculate Exponential Moving Average (EMA) for a given symbol."""
    prices = _get_historical_prices(symbol, days=max(30, window * 2))
    ema_series = ta.trend.EMAIndicator(close=prices, window=window).ema_indicator()
    return float(ema_series.dropna().iloc[-1])

def calculate_macd(symbol: str) -> dict:
    """Calculate MACD (Moving Average Convergence Divergence) for a given symbol."""
    prices = _get_historical_prices(symbol, days=60)
    macd_indicator = ta.trend.MACD(close=prices)
    return {
        "macd_line": float(macd_indicator.macd().dropna().iloc[-1]),
        "signal_line": float(macd_indicator.macd_signal().dropna().iloc[-1]),
        "histogram": float(macd_indicator.macd_diff().dropna().iloc[-1])
    }
