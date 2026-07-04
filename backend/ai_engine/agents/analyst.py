from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from backend.ai_engine.mcp.tools_market import market_tools
from backend.ai_engine.mcp.tools_news import news_tools
from backend.ai_engine.agents.state import AgentState
from backend.ai_engine.core.config import settings

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

# Bind tools
analyst_tools = market_tools + news_tools
analyst_llm = llm.bind_tools(analyst_tools)

def analyst_node(state: AgentState):
    messages = state.get("messages", [])
    
    system_prompt = SystemMessage(content="""
    You are the Crypto Analyst Agent for CRYPTOSE 2.0.
    Your role is to analyze market data, technical indicators, and news sentiment.
    You have access to tools to fetch live prices, market metrics, technical indicators, and latest news.
    Always use these tools to answer user queries with grounded data.
    If you recommend something, always explain WHY (Explainable AI principle).
    """)
    
    # In a real LangGraph setup with tools, this node would invoke the LLM, 
    # check for tool calls, execute them in a ToolNode, and return to the LLM.
    # For this scaffolding, we will just invoke the LLM and return its response.
    
    # We pass the history + system prompt
    input_messages = [system_prompt] + list(messages)
    
    try:
        response = analyst_llm.invoke(input_messages)
        # Assuming no tool calls for this simple mock if no API key is provided
        return {"final_response": response.content}
    except Exception as e:
        # Mock response fallback if API key is missing or invalid
        return {"final_response": "I am the Crypto Analyst Agent. (Mock response fallback: Ensure GOOGLE_API_KEY is set in .env to use Gemini)."}
