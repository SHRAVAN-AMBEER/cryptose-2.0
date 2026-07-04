from flask import Blueprint, jsonify, request
import requests

# Create a blueprint
crypto_bp = Blueprint('crypto', __name__)

@crypto_bp.route('/api/crypto-prices', methods=['GET'])
def get_crypto_prices():
    coins = request.args.get('coins', 'bitcoin,ethereum')  # default coins
    try:
        url = f'https://api.coingecko.com/api/v3/simple/price?ids={coins}&vs_currencies=usd'
        response = requests.get(url)
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
