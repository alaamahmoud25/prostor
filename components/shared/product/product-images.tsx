'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt={`Main product view ${current + 1}`}
        width={1000}
        height={1000}
        className="min-h-[300px] w-full object-cover object-center"
      />
      <div className="flex overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'relative mr-2 h-24 w-24 flex-shrink-0 cursor-pointer border-2 transition-all',
              current === index
                ? 'border-orange-500'
                : 'border-transparent hover:border-orange-300'
            )}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
