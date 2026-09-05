'use client';

import React, { memo, useMemo } from 'react';
import AppImage from './AppImage';

interface AppLogoProps {
  src?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * The TestAppara brand is intentionally a single fixed image.
 * Do not swap/invert/filter it when the site theme changes.
 */
const AppLogo = memo(function AppLogo({
  src = '/assests/images/testappara-icon-fixed.png',
  size = 32,
  className = '',
  onClick,
}: AppLogoProps) {
  const containerClassName = useMemo(() => {
    const classes = ['flex items-center shrink-0'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  // Use the compact circular TestAppara mark for a cleaner, smaller header logo.
  const width = size;

  return (
    <div className={containerClassName} onClick={onClick} aria-label="TestAppara">
      <AppImage
        src={src}
        alt="TestAppara"
        width={width}
        height={size}
        className="flex-shrink-0 rounded-full object-contain tw-brand-logo"
        style={{ width, height: size, objectFit: 'contain', filter: 'none', opacity: 1 }}
        priority={true}
        unoptimized={src.endsWith('.svg')}
      />
    </div>
  );
});

export default AppLogo;
