import { ImageResponse } from 'next/og';
import { Monogram, ogFonts } from '@/lib/og';

// iOS home-screen icon; iOS applies its own rounded mask, so no radius here.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  return new ImageResponse(<Monogram px={size.width} radius={0} />, {
    ...size,
    fonts: await ogFonts(),
  });
}
