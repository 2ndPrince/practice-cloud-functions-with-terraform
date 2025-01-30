// functions/src/functions/collectOrders.ts
import { Request, Response } from 'express';
import { AmazonSpApiClient } from '../clients/amazonSpApiClient';

/**
 * Core logic to collect orders from the Amazon SP API
 * and (optionally) save them to Firestore.
 *
 * This can be called by:
 *  - An Express route (local dev)
 *  - A Google Cloud Function (production)
 */
export const collectOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Use Amazon SP API client
        const spClient = new AmazonSpApiClient();
        const newOrders = await spClient.listOrders(
            "2025-01-01T00:00:00.000Z", "2025-01-05T00:00:00.000Z"
        );

        res.status(200).json({
            message: 'Orders collected successfully!',
            data: newOrders,
        });

        return newOrders;
    } catch (error) {
        console.error('Error in collectOrders function:', error);
        res.status(500).json({ error: 'Failed to collect orders' });
    }
}
