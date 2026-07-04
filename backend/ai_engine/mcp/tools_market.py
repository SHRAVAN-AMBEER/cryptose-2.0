import requests
from langchain_core.tools import tool
from backend.ai_engine.core.config import settings

@tool
def get_live_price(symbol: str) -> str:
    """
    Fetch the live price of a given cryptocurrency symbol using CoinGecko API.
    Args:
        symbol: The cryptocurrency symbol (e.g., 'BTC', 'ETH').
    """
    symbol = symbol.lower()
    
    # CoinGecko uses specific IDs, so we map common symbols to IDs
    symbol_map = {
        "btc": "bitcoin",
        "eth": "ethereum",
        "sol": "solana",
        "doge": "dogecoin",
        "ada": "cardano",
        "xrp": "ripple"
    }
    
    cg_id = symbol_map.get(symbol, symbol)
    
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={cg_id}&vs_currencies=usd"
    headers = {"x-cg-demo-api-key": settings.COINGECKO_API_KEY} if settings.COINGECKO_API_KEY else {}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if cg_id in data and "usd" in data[cg_id]:
            price = data[cg_id]["usd"]
            return f"The live price of {symbol.upper()} is ${price}."
        else:
            return f"Could not find price data for {symbol.upper()}."
    except Exception as e:
        return f"Error fetching price for {symbol.upper()}: {str(e)}"

@tool
def get_market_metrics(symbol: str) -> str:
    """
    Fetch market metrics like 24h change, volume, and market cap for a given cryptocurrency symbol.
    Args:
        symbol: The cryptocurrency symbol (e.g., 'BTC', 'ETH').
    """
    symbol = symbol.lower()
    symbol_map = {"btc": "bitcoin", "eth": "ethereum", "sol": "solana"}
    cg_id = symbol_map.get(symbol, symbol)
    
    url = f"https://api.coingecko.com/api/v3/coins/{cg_id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
    headers = {"x-cg-demo-api-key": settings.COINGECKO_API_KEY} if settings.COINGECKO_API_KEY else {}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        market_data = data.get("market_data", {})
        change_24h = market_data.get("price_change_percentage_24h", "N/A")
        volume = market_data.get("total_volume", {}).get("usd", "N/A")
        market_cap = market_data.get("market_cap", {}).get("usd", "N/A")
        
        return f"{symbol.upper()} Metrics: 24h Change: {change_24h}%, Volume: ${volume}, Market Cap: ${market_cap}"
    except Exception as e:
        return f"Error fetching metrics for {symbol.upper()}: {str(e)}"

@tool
def get_technical_indicators(symbol: str) -> str:
    """
    Calculate technical indicators (RSI, MACD, etc) for a given cryptocurrency symbol.
    Args:
        symbol: The cryptocurrency symbol (e.g., 'BTC').
    """
    # For a real implementation, we would pull OHLCV data from Binance/CoinGecko 
    # and calculate RSI/MACD using a library like pandas-ta.
    # For now, we return a structural placeholder.
    return f"Technical indicators for {symbol.upper()}: Calculating real indicators requires OHLCV data streaming."

market_tools = [get_live_price, get_market_metrics, get_technical_indicators]
