import React from 'react';
import type { IconName } from '../types';

export const paths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  swap: 'M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3',
  wallet: 'M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12M15 11h5v4h-5a2 2 0 0 1 0-4Z',
  chart: 'M4 19V9m6 10V5m6 14v-7m4 7H2',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1A1.7 1.7 0 0 0 4.3 7l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z',
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
  arrowUp: 'M12 19V5m-5 5 5-5 5 5',
  arrowDown: 'M12 5v14m-5-5 5 5 5-5',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  coffee: 'M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Zm12 2h1a3 3 0 0 1 0 6h-2',
  home: 'm3 11 9-8 9 8v9h-6v-6H9v6H3z',
  car: 'm5 11 2-5h10l2 5M5 11h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Zm1 6v2m12-2v2M6 14h.01M18 14h.01',
  bag: 'M6 8h12l1 13H5L6 8Zm3 2V6a3 3 0 0 1 6 0v4',
  bolt: 'm13 2-9 12h8l-1 8 9-12h-8l1-8Z',
  close: 'm6 6 12 12M18 6 6 18',
  mail: 'M4 5h16v14H4zM4 7l8 6 8-6',
  lock: 'M6 10h12v11H6zM9 10V7a3 3 0 0 1 6 0v3',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  user: 'M20 21a8 8 0 0 0-16 0m8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
};

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const path = paths[name] || paths['bolt'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
