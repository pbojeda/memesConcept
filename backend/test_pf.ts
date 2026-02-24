import { config } from './src/infrastructure/config';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const res = await fetch(`https://api.printful.com/store/products/421124734`, {
        headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID as string
        }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
run();
