import requests
from typing import Dict, Any
from .cache import with_cache

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

@with_cache(60)
def get_live_price(symbol: str) -> float:
    """Get the current price in USD for a cryptocurrency symbol (e.g. bitcoin)."""
    response = requests.get(f"{COINGECKO_BASE}/simple/price?ids={symbol.lower()}&vs_currencies=usd")
    data = response.json()
    if symbol.lower() in data:
        return data[symbol.lower()]['usd']
    raise ValueError(f"Symbol {symbol} not found on CoinGecko")

@with_cache(60)
def get_market_cap(symbol: str) -> float:
    """Get the market capitalization in USD for a cryptocurrency."""
    response = requests.get(f"{COINGECKO_BASE}/simple/price?ids={symbol.lower()}&vs_currencies=usd&include_market_cap=true")
    data = response.json()
    if symbol.lower() in data:
        return data[symbol.lower()]['usd_market_cap']
    raise ValueError(f"Symbol {symbol} not found on CoinGecko")

@with_cache(60)
def get_volume(symbol: str) -> float:
    """Get the 24h trading volume in USD for a cryptocurrency."""
    response = requests.get(f"{COINGECKO_BASE}/simple/price?ids={symbol.lower()}&vs_currencies=usd&include_24hr_vol=true")
    data = response.json()
    if symbol.lower() in data:
        return data[symbol.lower()]['usd_24h_vol']
    raise ValueError(f"Symbol {symbol} not found on CoinGecko")

@with_cache(60)
def get_24h_change(symbol: str) -> float:
    """Get the 24h price change percentage for a cryptocurrency."""
    response = requests.get(f"{COINGECKO_BASE}/simple/price?ids={symbol.lower()}&vs_currencies=usd&include_24hr_change=true")
    data = response.json()
    if symbol.lower() in data:
        return data[symbol.lower()]['usd_24h_change']
    raise ValueError(f"Symbol {symbol} not found on CoinGecko")
