import { NextRequest } from 'next/server';
import { sendTelegramMessage } from '@/utils/telegram';
import { getLocationByIp } from '@/utils/geolocation';
import { parseUserAgent } from '@/utils/userAgent';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, userId } = body;

  if (!type || !userId) {
    return new Response(JSON.stringify({ error: 'Type and userId are required' }), { status: 400 });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const { device, os, browser } = parseUserAgent(userAgent);

  let message = '';

  // --- User Info Block ---
  const userInfoParts = [];
  const clickableUserId = `#user${userId}`;
  userInfoParts.push(`*User ID:* ${clickableUserId}`);
  if (ip && ip !== '127.0.0.1') {
    try {
      const location = await getLocationByIp(ip);
      userInfoParts.push(`*IP:* \`${ip}\``);
      userInfoParts.push(`*Location:* ${location.country}, ${location.country_code}`);
    } catch (e) {
      userInfoParts.push(`*IP:* \`${ip}\` (Location lookup failed)`);
    }
  } else {
    userInfoParts.push(`*IP:* \`127.0.0.1\` (Local)`);
  }
  userInfoParts.push(`*Device:* ${device} / ${os} / ${browser}`);
  const userInfo = userInfoParts.join('\n');

  // --- Message Formatting ---
  if (type === 'visit') {
    const { isNew } = body;
    const title = isNew ? '👤 New User Visit' : '🚶‍♂️ Returning User Visit';
    message = `*${title}*\n\n${userInfo}`;
  } else if (type === 'spin') {
    const { result } = body;
    const title = '🎰 Spin Event';
    const resultInfo = `*Result:* ${result.amount} ${result.currency} (Promocode: \`${result.promocode}\`)`;
    message = `*${title}*\n\n${resultInfo}\n\n${userInfo}`;
  } else if (type === 'conversion') {
    const { result } = body;
    const title = '🏆 Conversion Event';
    const resultInfo = `*Result:* ${result.amount} ${result.currency} (Promocode: \`${result.promocode}\`)\n*Local Prize:* ${result.localAmount}`;
    message = `*${title}*\n\n${resultInfo}\n\n${userInfo}`;
  } else {
    return new Response(JSON.stringify({ error: 'Invalid event type' }), { status: 400 });
  }

  return await sendTelegramMessage(message);
}