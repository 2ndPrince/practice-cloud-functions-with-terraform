import { http } from '@google-cloud/functions-framework';
import app from './app';
import { collectOrders } from "./functions/collectOrders";

http('myFunction', app);
http('collectOrders', collectOrders);