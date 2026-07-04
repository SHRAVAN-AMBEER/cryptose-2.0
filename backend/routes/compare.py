from flask import Blueprint, request, jsonify
import requests
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime
import os
import logging
import google.generativeai as genai
from backend.config import Config

compare_bp = Blueprint('compare', __name__)

genai.configure(api_key=Config.GEMINI_API_KEY)
logger = logging.getLogger(__name__)

@compare_bp.route('/api/compare', methods=['GET'])
def compare_coins():
    coins_param = request.args.get('coins')
    if not coins_param:
        return jsonify({"error": "No coins specified"}), 400

    coin_ids = coins_param.split(',')

    plt.figure(figsize=(10, 6))

    colors = ['blue', 'red', 'green', 'orange', 'purple', 'brown']
    for idx, coin_id in enumerate(coin_ids):
        try:
            url = f'https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days=7'
            response = requests.get(url)
            if response.status_code == 429:
                logger.error(f"Rate limit exceeded for CoinGecko API when fetching data for {coin_id}")
                return jsonify({"error": "Rate limit exceeded for CoinGecko API. Please try again later."}), 429
            data = response.json()
            prices = data.get('prices', [])
            dates = [datetime.utcfromtimestamp(p[0]/1000).strftime('%m-%d') for p in prices]
            values = [p[1] for p in prices]
            plt.plot(dates, values, label=coin_id.capitalize(), color=colors[idx % len(colors)])
        except Exception as e:
            logger.error(f"Error fetching data for {coin_id}: {str(e)}")
            continue

    plt.title('7-Day Price Comparison')
    plt.xlabel('Date')
    plt.ylabel('Price (USD)')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close()
    img.seek(0)
    img_base64 = base64.b64encode(img.getvalue()).decode()

    return jsonify({"image": img_base64})

@compare_bp.route('/api/ai-assist', methods=['POST'])
def ai_assist():
    data = request.get_json()
    selected_coins = data.get('coins')
    if selected_coins is None or not isinstance(selected_coins, list):
        return jsonify({"error": "Invalid or missing 'coins' in request body"}), 400

    if len(selected_coins) == 0:
        return jsonify({"error": "No coins provided. Please select coins."}), 400

    try:
        prompt = (
            "You are a crypto investment assistant.\n"
            "Given the following list of coins:\n"
            f"{', '.join(selected_coins)}\n\n"
            "Please recommend the best coin to invest in right now and provide clear reasons for your recommendation.\n"
            "Compare the coins and provide a clear recommendation.\n"
            "Please provide a detailed analysis of the current market trends and any relevant news that may affect the investment decision.\n"
            
        )

        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        logger.info("Calling Gemini API for coin investment recommendation...")
        response = model.generate_content(prompt)
        logger.info(f"Full AI response object: {response}")
        if not response or not hasattr(response, 'text') or not response.text.strip():
            logger.error("AI response is invalid or empty")
            return jsonify({"error": "AI returned an invalid or empty response"}), 500
        recommendation = response.text.strip()
        logger.info(f"AI recommendation: {recommendation}")
        return jsonify({"recommendation": recommendation})
    except Exception as e:
        logger.error(f"AI assist failed: {str(e)}")
        return jsonify({"error": str(e)}), 500
