import axios, { AxiosInstance, isAxiosError } from 'axios';
import { getEnv } from '../config/env.js';
import { WhatsAppApiError, WhatsAppApiResponse, WhatsAppPayload } from '../types/whatsapp.types.js';

export class WhatsAppCloudApiClient {
  private http: AxiosInstance;
  private phoneNumberId: string;
  private apiVersion: string;

  constructor() {
    const env = getEnv();
    this.phoneNumberId = env.META_PHONE_NUMBER_ID;
    this.apiVersion = env.META_GRAPH_API_VERSION;

    this.http = axios.create({
      baseURL: `https://graph.facebook.com/${this.apiVersion}`,
      headers: {
        Authorization: `Bearer ${env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10_000,
    });
  }

  async sendMessage(payload: WhatsAppPayload): Promise<WhatsAppApiResponse> {
    try {
      const { data } = await this.http.post<WhatsAppApiResponse>(
        `/${this.phoneNumberId}/messages`,
        payload,
      );
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const apiError = err.response.data as WhatsAppApiError;
        throw new WhatsAppApiClientError(
          apiError.error.message,
          apiError.error.code,
          apiError.error.type,
        );
      }
      throw err;
    }
  }
}

export class WhatsAppApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly type: string,
  ) {
    super(message);
    this.name = 'WhatsAppApiClientError';
  }
}
