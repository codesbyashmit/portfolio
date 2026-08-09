'use client';

import React from 'react';
import Image from 'next/image';

export const GlitchedHeroImage = () => {
  return (
    <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center pointer-events-none select-none">
      <div className="relative w-full h-full lg:scale-125 xl:scale-[1.35] translate-y-4">
        <Image
          src="/image-hero.png"
          alt="Ashmit Kumar"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1000px"
          className="object-contain object-center"
        />
      </div>
    </div>
  );
};