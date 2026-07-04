import time
from functools import wraps
from collections import deque
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window  # in seconds
        self.requests = deque(maxlen=max_requests)
        
    def can_make_request(self):
        now = time.time()
        
        # Remove old requests
        while self.requests and self.requests[0] < now - self.time_window:
            self.requests.popleft()
            
        # Check if we can make a new request
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False

    def wait_for_token(self):
        while not self.can_make_request():
            time.sleep(0.1)  # Wait 100ms before checking again
        return True

# Create a rate limiter instance for CoinGecko
# Free tier allows 10-30 calls per minute
coingecko_limiter = RateLimiter(max_requests=10, time_window=60)

def rate_limit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        coingecko_limiter.wait_for_token()
        return func(*args, **kwargs)
    return wrapper
