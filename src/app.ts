// src/app.ts
import express from 'express';
import { Request, Response } from 'express';

import morgan from 'morgan';
import { collectOrders } from "./functions/collectOrders";

const app = express();

// Use Morgan for request logging
app.use(morgan('dev'));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello from Express on GCP Cloud Functions!');
});

app.get('/test', (req, res) => {
    res.send('test');
});

app.post('/collectOrders', async (req: Request, res: Response) => {
    await collectOrders(req, res);
});

export default app;

// Export the function for cloud deployment
export const collectOrdersFunction = (req: Request, res: Response) => {
    if (req.path === '/collectOrders' && req.method === 'POST') {
        return collectOrders(req, res);
    }
    res.status(404).send('Not Found');
};

// Only start the server if this file is run directly (local dev scenario):
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Local dev server listening on http://localhost:${port}`);
    });
}
