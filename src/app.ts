// src/app.ts
import express from 'express';
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

app.post('/collectOrders', collectOrders);

export default app;
