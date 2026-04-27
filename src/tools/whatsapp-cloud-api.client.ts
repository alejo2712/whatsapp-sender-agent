import axios, { AxiosInstance, isAxiosError } from 'axios';
import { getLiveCredentials } from '../config/env.js';
import { WhatsAppApiError, WhatsAppApiResponse, WhatsAppPayload } from '../types/whatsapp.types.js';
import { IWhatsAppClient } from './whatsapp-client.interface.js';

/**
 * Live Meta WhatsApp Cloud API client.
 * Only instantiated when WHATSAPP_MODE=live.
 * Throws at construction if Meta credentials are missing.
 *
 * TODO: REAL API CALL — this is the integration point with Meta Graph API.
 * Blocked until META_ACCESS_TOKEN and META_PHONE_NUMBER_ID are available.
 * See docs/meta-whatsapp-setup.md for credential setup instructions.
 */
export class WhatsAppCloudApiClient implements IWhatsAppClient {
  private http: AxiosInstance;
  private phoneNumberId: string;

  constructor() {
    // TODO: REAL API CALL — getLiveCredentials() will throw if credentials are not set
    const creds = getLiveCredentials();
    this.phoneNumberId = creds.META_PHONE_NUMBER_ID;

    this.http = axios.create({
      baseURL: `https://graph.facebook.com/${creds.META_GRAPH_API_VERSION}`,
      headers: {
        Authorization: `Bearer ${creds.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10_000,
    });
  }

  async sendMessage(payload: WhatsAppPayload): Promise<WhatsAppApiResponse> {
    // TODO: REAL API CALL — POST to /{phoneNumberId}/messages
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
