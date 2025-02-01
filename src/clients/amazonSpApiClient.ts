// functions/src/clients/amazonSpApiClient.ts
import axios from 'axios';
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

const BASE_URL_SP_API = 'https://sellingpartnerapi-na.amazon.com';
const BASE_URL_AUTH = 'https://api.amazon.com/auth/o2/token';

/**
 * A simple placeholder for the Amazon SP API client.
 * In reality, you would handle authentication with AWS IAM / LWA tokens,
 * set the correct base URL, etc.
 */
export class AmazonSpApiClient {
    private clientId: string | null = null;
    private clientSecret: string | null = null;
    private refreshToken: string | null = null;
    private accessToken: string | null = null;
    private accessTokenExpiry: number | null = null;
    private secretManager: SecretManagerServiceClient;

    constructor() {

        this.secretManager = new SecretManagerServiceClient();
    }

    /**
     * Fetch secrets from GCP Secret Manager.
     */
    private async fetchSecrets(): Promise<void> {
        try {
            const [clientId] = await this.secretManager.accessSecretVersion({
                name: 'projects/554863697533/secrets/SP_API_CLIENT_ID/versions/latest',
            });

            const [clientSecret] = await this.secretManager.accessSecretVersion({
                name: 'projects/554863697533/secrets/SP_API_CLIENT_SECRET/versions/latest',
            });

            const [refreshToken] = await this.secretManager.accessSecretVersion({
                name: 'projects/554863697533/secrets/SP_API_REFRESH_TOKEN/versions/latest',
            });

            this.clientId = clientId.payload?.data?.toString() || null;
            this.clientSecret = clientSecret.payload?.data?.toString() || null;
            this.refreshToken = refreshToken.payload?.data?.toString() || null;

            if (!this.clientId || !this.clientSecret || !this.refreshToken) {
                console.error('❌ Missing required secrets from GCP Secret Manager');
            }

            console.log('✅ Secrets successfully loaded from GCP');
        } catch (error) {
            console.error('❌ Error fetching secrets from GCP Secret Manager:', error);
            throw new Error('Failed to load secrets');
        }
    }

    /**
     * Get a new access token from Amazon using the refresh token.
     */
    private async getAccessToken(): Promise<string> {
        if (this.accessToken && this.accessTokenExpiry && Date.now() < this.accessTokenExpiry) {
            console.log('🔑 Using cached access token');
            return this.accessToken;
        }

        if (!this.clientId || !this.clientSecret || !this.refreshToken) {
            await this.fetchSecrets();
        }

        const authPayload = new URLSearchParams();
        authPayload.append('grant_type', 'refresh_token');
        authPayload.append('refresh_token', this.refreshToken as string);
        authPayload.append('client_id', this.clientId as string);
        authPayload.append('client_secret', this.clientSecret as string);

        try {
            const response = await axios.post(BASE_URL_AUTH, authPayload.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            this.accessToken = response.data.access_token;
            this.accessTokenExpiry = Date.now() + response.data.expires_in * 1000;

            console.log('✅ Successfully authenticated with Amazon SP API');
            return response.data.access_token; // Always get a fresh token
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Authentication failed:', error.response?.data || error.message);
            } else {
                console.error('❌ Authentication failed:', error);
            }
            throw new Error('Amazon authentication failed');
        }
    }

    /**
     * API call using fresh access token.
     */
    public async listOrders(createdAfter: string, createdBefore: string, nextToken?: string): Promise<AmazonOrder[]> {
        const accessToken = await this.getAccessToken(); // Always get a fresh token - no need to retain for serverless
        const orders: AmazonOrder[] = [];

        const params: any = {
            CreatedAfter: createdAfter,
            CreatedBefore: createdBefore,
            MarketplaceIds: 'ATVPDKIKX0DER', // US marketplace ID
        }

        if (nextToken) {
            params.NextToken = nextToken;
        }

        try {
            const response = await axios.get<AmazonOrderResponse>(`${BASE_URL_SP_API}/orders/v0/orders`, {
                headers: {
                    'x-amz-access-token': accessToken,
                },
                params,
            });

            orders.push(...response.data.payload.Orders);

            if (response.data.payload.NextToken) {
                const nextOrders = await this.listOrders(createdAfter, createdBefore, response.data.payload.NextToken);
                orders.push(...nextOrders);
            }

            return orders;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Error fetching orders:', error.response?.data || error.message);
            } else {
                console.error('❌ Error fetching orders:', error);
            }
            throw new Error('Failed to fetch orders');
        }
    }
}
