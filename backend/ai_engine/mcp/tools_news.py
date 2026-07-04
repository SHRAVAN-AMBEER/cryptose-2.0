import feedparser
from langchain_core.tools import tool

@tool
def get_latest_news(topic: str) -> str:
    """
    Fetch the latest crypto news headlines for a specific topic or symbol.
    Args:
        topic: The topic or symbol to search for (e.g., 'Bitcoin', 'Regulation', 'ETH').
    """
    # Using CoinDesk RSS Feed (100% Free, no API key needed)
    rss_url = "https://www.coindesk.com/arc/outboundfeeds/rss/"
    
    try:
        feed = feedparser.parse(rss_url)
        headlines = []
        
        # Filter for the topic
        for entry in feed.entries:
            if topic.lower() in entry.title.lower() or topic.lower() in entry.summary.lower():
                headlines.append(f"- {entry.title}")
            
            if len(headlines) >= 3:
                break
                
        if not headlines:
            # If no specific match, just return top 2
            headlines = [f"- {entry.title}" for entry in feed.entries[:2]]
            return f"Top general news:\n" + "\n".join(headlines)
            
        return f"Latest news for '{topic}':\n" + "\n".join(headlines)
    except Exception as e:
        return f"Error fetching news: {str(e)}"

@tool
def get_social_sentiment(symbol: str) -> str:
    """
    Get social media sentiment analysis for a given cryptocurrency symbol.
    Args:
        symbol: The cryptocurrency symbol (e.g., 'BTC', 'ETH').
    """
    # Social sentiment usually requires paid APIs (like LunarCrush or Twitter API)
    # We will return a placeholder for this specific tool for now.
    return f"Sentiment for {symbol.upper()} is currently unavailable (requires a paid social API)."

news_tools = [get_latest_news, get_social_sentiment]
