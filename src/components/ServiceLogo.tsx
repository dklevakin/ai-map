import { useState } from 'react';
import { clsx } from 'clsx';
import { getFallbackLogo, getServiceLogoUrl } from '../lib/logo';

interface ServiceLogoProps {
  href: string;
  name: string;
  size?: number;
  className?: string;
}

export function ServiceLogo({ href, name, size = 32, className }: ServiceLogoProps) {
  const [broken, setBroken] = useState(false);
  const computedSrc = broken ? getFallbackLogo() : getServiceLogoUrl(href);

  return (
    <img
      src={computedSrc}
      width={size}
      height={size}
      loading="lazy"
      alt={name}
      className={clsx('service-logo', className)}
      onError={() => {
        if (!broken) {
          setBroken(true);
        }
      }}
    />
  );
}
