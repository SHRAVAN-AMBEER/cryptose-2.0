import os
import json
import logging
from functools import wraps
from typing import Any, Callable

# Load environment variables or configuration
try:
    from backend.ai_engine.core.config import settings
    REDIS_URL = settings.REDIS_URL
except ImportError:
    REDIS_URL = os.getenv("REDIS_URL", "")

logger = logging.getLogger(__name__)

# Try to initialize Redis
redis_client = None
try:
    import redis
    if REDIS_URL and (REDIS_URL.startswith("redis://") or REDIS_URL.startswith("rediss://")):
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        # Test connection
        redis_client.ping()
        logger.info("✅ Redis connected successfully for MCP Caching")
    else:
        logger.warning(f"⚠️ REDIS_URL '{REDIS_URL}' is invalid for TCP Redis. Falling back to local cache.")
except Exception as e:
    logger.warning(f"⚠️ Failed to connect to Redis: {e}. Falling back to local cache.")
    redis_client = None

# Fallback in-memory cache
local_cache = {}
import time

def get_cached_data(key: str) -> Any:
    if redis_client:
        try:
            data = redis_client.get(key)
            if data:
                return json.loads(data)
        except Exception:
            pass
    else:
        if key in local_cache:
            entry = local_cache[key]
            if time.time() < entry["expires_at"]:
                return entry["data"]
            else:
                del local_cache[key]
    return None

def set_cached_data(key: str, data: Any, ttl_seconds: int):
    if redis_client:
        try:
            redis_client.setex(key, ttl_seconds, json.dumps(data))
        except Exception:
            pass
    else:
        local_cache[key] = {
            "data": data,
            "expires_at": time.time() + ttl_seconds
        }

def with_cache(ttl_seconds: int = 60):
    """Decorator to cache function results using Redis (or local fallback)."""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create a unique cache key based on function name and arguments
            key_parts = [func.__name__]
            key_parts.extend([str(a) for a in args])
            key_parts.extend([f"{k}={v}" for k, v in sorted(kwargs.items())])
            cache_key = ":".join(key_parts)
            
            # Try to get from cache
            cached = get_cached_data(cache_key)
            if cached is not None:
                from backend.ai_engine.core.telemetry import record_cache
                record_cache(hit=True)
                return cached
                
            from backend.ai_engine.core.telemetry import record_cache
            record_cache(hit=False)
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Save to cache
            # If the result is a pandas Series/DataFrame (like in TA tools), we need to serialize it
            import pandas as pd
            if isinstance(result, (pd.Series, pd.DataFrame)):
                set_cached_data(cache_key, result.to_json(), ttl_seconds)
            else:
                set_cached_data(cache_key, result, ttl_seconds)
                
            return result
        return wrapper
    return decorator
