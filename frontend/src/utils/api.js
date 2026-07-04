"use client";
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';

export const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
});

// Add request interceptor for auth token and logging
api.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🚀 API Request:', { 
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export const trackCoinView = async (coin, source = 'graph') => {
    try {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');
        if (!userEmail || !token || !coin) return;

        await axios.post('http://localhost:5000/track-coin-view', {
            email: userEmail,
            coinId: coin.id,
            price: coin.current_price || coin.market_data?.current_price?.usd || 0,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            market_cap: coin.market_cap || 0,
            market_cap_rank: coin.market_cap_rank || 0,
            source: source
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error tracking coin view:', error);
    }
};

export const trackCompareCoins = async (coins) => {
    try {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');
        if (!userEmail || !token || !coins || coins.length < 2) return;

        await axios.post('http://localhost:5000/track-compare-coins', {
            email: userEmail,
            coins: coins.map(coin => ({
                id: coin.id,
                price: coin.current_price || coin.market_data?.current_price?.usd || 0,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image,
                market_cap: coin.market_cap || 0,
                market_cap_rank: coin.market_cap_rank || 0
            }))
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error tracking coin comparison:', error);
    }
};