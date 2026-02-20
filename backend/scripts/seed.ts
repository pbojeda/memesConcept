import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../src/infrastructure/database';
import { Product } from '../src/domain/models/Product';

const products = [
    {
        name: 'This is Fine Dog Plush',
        description: 'When everything is burning around you, just hug this dog.',
        price: 2500, // $25.00
        imageUrl: 'https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif',
        slug: 'this-is-fine-plush',
        variants: [
            { size: 'S', color: 'Orange', stock: 100 },
            { size: 'L', color: 'Orange', stock: 50 },
        ],
    },
    {
        name: 'Distracted Boyfriend T-Shirt',
        description: 'Look at other memes while your current meme looks at you in disgust.',
        price: 2000, // $20.00
        imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
        slug: 'distracted-boyfriend-tshirt',
        variants: [
            { size: 'M', color: 'White', stock: 200 },
            { size: 'L', color: 'White', stock: 150 },
            { size: 'XL', color: 'Black', stock: 100 },
        ],
    },
    {
        name: 'Success Kid Mug',
        description: 'Start your day with a fist pump of victory.',
        price: 1500, // $15.00
        imageUrl: 'https://i.imgflip.com/1bip.jpg',
        slug: 'success-kid-mug',
        variants: [
            { size: 'Standard', color: 'White', stock: 300 },
        ],
    },
];

const seed = async () => {
    console.log('🌱 Seeding database...');
    await connectToDatabase();

    try {
        await Product.deleteMany({});
        console.log('🧹 Cleared existing products');

        await Product.insertMany(products);
        console.log(`✅ Seeded ${products.length} products`);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await disconnectFromDatabase();
        console.log('👋 Disconnected');
    }
};

seed();
