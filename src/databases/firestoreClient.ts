// functions/src/databases/firestoreClient.ts
import { Firestore } from '@google-cloud/firestore';
import { DBAmazonOrder } from "../interfaces/dbAmazonOrder.interface";

const firestore = new Firestore({
    ignoreUndefinedProperties: true,
});

export const saveOrders = async (orders: DBAmazonOrder[]): Promise<number> => {
    const batch = firestore.batch();
    orders.forEach((order) => {
        const orderRef = firestore.collection('orders').doc(order.amazonOrderId);
        batch.set(orderRef, order);
    });
    const writeResults = await batch.commit();
    console.log(`✅ ${writeResults.length} orders saved to Firestore`);
    return writeResults.length;
};