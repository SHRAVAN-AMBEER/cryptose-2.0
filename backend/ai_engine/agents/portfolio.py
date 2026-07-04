from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from backend.ai_engine.agents.state import AgentState

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)

def portfolio_node(state: AgentState):
    messages = state.get("messages", [])
    portfolio = state.get("portfolio_data", {})
    
    system_prompt = SystemMessage(content=f"""
    You are the Portfolio Advisor Agent for CRYPTOSE 2.0.
    Your role is to analyze the user's portfolio and risk appetite, and provide recommendations.
    Always explain WHY you recommend a certain action.
    
    User Portfolio Data: {portfolio}
    """)
    
    input_messages = [system_prompt] + list(messages)
    
    try:
        response = llm.invoke(input_messages)
        return {"final_response": response.content}
    except Exception as e:
        return {"final_response": "I am the Portfolio Advisor Agent. (Mock response fallback: Ensure GOOGLE_API_KEY is set in .env to use Gemini)."}
