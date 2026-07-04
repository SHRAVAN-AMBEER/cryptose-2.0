from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from typing import Any, Dict, List
import time
from backend.ai_engine.core.telemetry import record_tokens, record_tool_call

class TelemetryCallbackHandler(BaseCallbackHandler):
    """Callback handler to track LLM metrics (tokens, latency) and tool executions."""
    
    def __init__(self):
        super().__init__()
        self.start_times: Dict[str, float] = {}

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> Any:
        pass

    def on_chat_model_start(
        self, serialized: Dict[str, Any], messages: List[List[BaseMessage]], **kwargs: Any
    ) -> Any:
        run_id = kwargs.get("run_id")
        if run_id:
            self.start_times[str(run_id)] = time.time()

    def on_llm_end(self, response: Any, **kwargs: Any) -> Any:
        # Extract Token Usage
        if response.llm_output and "token_usage" in response.llm_output:
            usage = response.llm_output["token_usage"]
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            record_tokens(prompt_tokens, completion_tokens)
            
        # Extract latency
        run_id = kwargs.get("run_id")
        if run_id and str(run_id) in self.start_times:
            elapsed = time.time() - self.start_times[str(run_id)]
            from backend.ai_engine.core.telemetry import get_telemetry
            t = get_telemetry()
            if t:
                t["latency_ms"] += (elapsed * 1000)

    def on_tool_start(
        self, serialized: Dict[str, Any], input_str: str, **kwargs: Any
    ) -> Any:
        tool_name = serialized.get("name", "unknown_tool")
        record_tool_call(tool_name)
