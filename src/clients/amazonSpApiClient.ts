// functions/src/clients/amazonSpApiClient.ts
import axios, { AxiosInstance } from 'axios';
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

/**
 * A simple placeholder for the Amazon SP API client.
 * In reality, you would handle authentication with AWS IAM / LWA tokens,
 * set the correct base URL, etc.
 */
export class AmazonSpApiClient {
    private client: AxiosInstance;
    private clientId: string | null = null;
    private clientSecret: string | null = null;
    private refreshToken: string | null = null;
    private secretManager: SecretManagerServiceClient;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://sellingpartnerapi-na.amazon.com',
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
                throw new Error('Missing required secrets from GCP Secret Manager');
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
        if (!this.clientId || !this.clientSecret || !this.refreshToken) {
            await this.fetchSecrets();
        }

        const authPayload = new URLSearchParams();
        authPayload.append('grant_type', 'refresh_token');
        authPayload.append('refresh_token', this.refreshToken as string);
        authPayload.append('client_id', this.clientId as string);
        authPayload.append('client_secret', this.clientSecret as string);

        try {
            const response = await axios.post('https://api.amazon.com/auth/o2/token', authPayload.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

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
    public async listOrders(createdAfter: string, createdBefore: string): Promise<any> {
        const accessToken = await this.getAccessToken(); // Always get a fresh token

        try {
            const response = await axios.get('https://sellingpartnerapi-na.amazon.com/orders/v0/orders', {
                headers: {
                    'x-amz-access-token': accessToken,
                },
                params: {
                    CreatedAfter: createdAfter,
                    CreatedBefore: createdBefore,
                    MarketplaceIds: 'ATVPDKIKX0DER', // US marketplace
                }
            });

            return response.data;
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
