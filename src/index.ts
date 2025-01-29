import { http } from '@google-cloud/functions-framework';
import app, {collectOrdersFunction} from './app';

http('myFunction', app);
http('collectOrders', collectOrdersFunction);

exports.collectOrdersFunction = collectOrdersFunction;