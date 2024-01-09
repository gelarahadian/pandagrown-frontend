export const config = {
    api: {
      API_URL : 'https://api.pandagrown.com/',
      IMAGE_URL : 'https://api.pandagrown.com',
      IMAGE_BASE_URL : 'https://api.pandagrown.com/images/',
      WS_URL : 'wss://api.pandagrown.com/ws/',
      // API_URL : 'http://127.0.0.1:8000/',
      // IMAGE_URL : 'http://127.0.0.1:8000',
      // IMAGE_BASE_URL : 'http://127.0.0.1:8000/images/',
      // WS_URL : 'ws://162.254.37.183:8000/ws/',
      // API_URL : 'http://192.168.1.99:8000/',
      // IMAGE_URL : 'http://192.168.1.99:8000',
      // IMAGE_BASE_URL : 'http://192.168.1.99:8000/images/',
      // WS_URL : 'ws://192.168.1.99:8000/ws/',
      COIN_PRICE_URL : 'https://api.coingecko.com/api/v3/simple/price',
    },
    other: {
      RECAPCHA_SITE_KEY : '6Lc2lP0nAAAAAO-EPh3UtRj2fVWxNJk_RbjNrw2q',
    },
    pga: {
        botaniPrice : 3,
        rhizoPrice: 2,
        silicaPrice: 1,
        botaniProfit: -7,
        rhizoProfit: 4.6, // more percentage
        silicaProfit: -3
    },
    withdraw_fee: 2,
    min_withdraw: 50
};