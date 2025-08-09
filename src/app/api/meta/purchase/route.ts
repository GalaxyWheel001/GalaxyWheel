import { NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';
import crypto from 'crypto';

export const runtime = 'nodejs';

function sha256(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.toString().trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Server is not configured: META_PIXEL_ID or META_ACCESS_TOKEN is missing' }),
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const {
      email,
      phone,
      event_id,
      value,
      currency = 'USD',
      event_source_url,
      event_name = 'Purchase',
      external_id,
      test_event_code
    } = body || {};

    if (value == null) {
      return new Response(JSON.stringify({ error: 'value is required' }), { status: 400 });
    }

    const ipHeader = req.headers.get('x-forwarded-for') || '';
    const clientIpAddress = ipHeader.split(',')[0].trim() || undefined;
    const clientUserAgent = req.headers.get('user-agent') || undefined;

    const rawUserData: Record<string, unknown> = {
      em: email ? [sha256(email)] : undefined,
      ph: phone ? [sha256(phone)] : undefined,
      external_id: external_id ? [sha256(external_id)] : undefined,
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent
    };

    const user_data = Object.fromEntries(
      Object.entries(rawUserData).filter(([, v]) => v !== undefined)
    );

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: event_source_url,
          event_id: event_id || undefined,
          user_data,
          custom_data: {
            currency,
            value: typeof value === 'string' ? Number(value) : value
          }
        }
      ]
    };

    // Add test_event_code if provided (useful for Pixel Helper Test Events)
    const queryParams = new URLSearchParams();
    queryParams.set('access_token', ACCESS_TOKEN);
    if (test_event_code) queryParams.set('test_event_code', String(test_event_code));

    const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?${queryParams.toString()}`;

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10_000
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: unknown) {
    let status = 500;
    let details: unknown = null;
    if (isAxiosError(error)) {
      status = error.response?.status ?? 500;
      details = error.response?.data ?? null;
    } else if (error instanceof Error) {
      details = error.message;
    }
    console.error('Meta CAPI error:', details);
    return new Response(
      JSON.stringify({ error: 'Failed to send event to Meta', details }),
      { status }
    );
  }
} 