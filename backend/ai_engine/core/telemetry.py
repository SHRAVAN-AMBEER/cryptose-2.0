from contextvars import ContextVar
import time

# A request-scoped telemetry dictionary
_telemetry_ctx: ContextVar[dict] = ContextVar("telemetry_ctx", default={})

def init_telemetry(session_id: str):
    """Initialize a fresh telemetry state for the current request."""
    _telemetry_ctx.set({
        "timestamp": time.time(),
        "session_id": session_id,
        "selected_agent": None,
        "tool_calls": [],
        "cache": {"hit": 0, "miss": 0},
        "latency_ms": 0.0,
        "tokens": {"input": 0, "output": 0, "total": 0},
        "status": "success",
        "rag_metrics": {
            "chunks_retrieved": 0,
            "average_similarity_score": 0.0,
            "relevance": "unknown"
        },
        "router_metrics": {
            "rule_based": False,
            "llm_fallback": False,
            "confidence": 0.0
        },
        "llm_metrics": {
            "hallucination_flag": False,
            "guardrail_trigger": False
        }
    })

def get_telemetry() -> dict:
    return _telemetry_ctx.get()

def record_cache(hit: bool):
    t = get_telemetry()
    if t:
        if hit:
            t["cache"]["hit"] += 1
        else:
            t["cache"]["miss"] += 1

def record_router(decision: str, is_rule_based: bool):
    t = get_telemetry()
    if t:
        t["selected_agent"] = decision
        if is_rule_based:
            t["router_metrics"]["rule_based"] = True
            t["router_metrics"]["confidence"] = 1.0
        else:
            t["router_metrics"]["llm_fallback"] = True
            t["router_metrics"]["confidence"] = 0.8 # arbitrary for LLM fallback unless probability extracted

def record_rag(chunks: int, avg_score: float):
    t = get_telemetry()
    if t:
        t["rag_metrics"]["chunks_retrieved"] = chunks
        t["rag_metrics"]["average_similarity_score"] = avg_score
        t["rag_metrics"]["relevance"] = "high" if avg_score > 0.7 else "low"

def record_tool_call(tool_name: str):
    t = get_telemetry()
    if t and tool_name not in t["tool_calls"]:
        t["tool_calls"].append(tool_name)

def record_tokens(input_tokens: int, output_tokens: int):
    t = get_telemetry()
    if t:
        t["tokens"]["input"] += input_tokens
        t["tokens"]["output"] += output_tokens
        t["tokens"]["total"] = t["tokens"]["input"] + t["tokens"]["output"]

def record_guardrail_trigger():
    t = get_telemetry()
    if t:
        t["llm_metrics"]["guardrail_trigger"] = True
        t["status"] = "security_blocked"
