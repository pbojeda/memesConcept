import { config } from './src/infrastructure/config';
import { PrintfulService } from './src/infrastructure/services/PrintfulService';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const res = await PrintfulService.createSyncProduct({
        sync_product: {
            name: "Test Create PF",
            thumbnail: "https://placehold.co/400"
        },
        sync_variants: [
            {
                variant_id: 4012,
                retail_price: "49.00",
                files: [{ url: "https://placehold.co/400" }]
            }
        ]
    });
    console.log(JSON.stringify(res, null, 2));
}
run();
