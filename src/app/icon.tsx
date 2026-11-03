import { ImageResponse } from 'next/og';
import { Monogram, ogFonts } from '@/lib/og';

// Rendered large so it stays crisp on high-DPI tabs; browsers scale it down.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(<Monogram px={size.width} radius={14} />, {
    ...size,
    fonts: await ogFonts(),
  });
}
