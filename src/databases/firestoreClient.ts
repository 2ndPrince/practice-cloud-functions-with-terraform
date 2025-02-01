// functions/src/databases/firestoreClient.ts
import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

export const saveOrders = async (orders: AmazonOrder[]): Promise<number> => {
    const batch = firestore.batch();
    orders.forEach((order) => {
        const orderRef = firestore.collection('orders').doc(order.AmazonOrderId);
        batch.set(orderRef, order);
    });
    const writeResults = await batch.commit();
    console.log(`✅ ${writeResults.length} orders saved to Firestore`);
    return writeResults.length;
};