import React from 'react';
import { IconProps } from '@/components/icons/icon';

export default function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.76 10.189A6.998 6.998 0 1 0 5.24 13.81a6.998 6.998 0 0 0 13.52-3.622Zm-8.191-3.53a5.503 5.503 0 0 1 3.016.042l.408.857-.931.796a1.192 1.192 0 0 0-.417.946l-.585-.188a1.192 1.192 0 0 0-1.52.834l-.02.077a1.192 1.192 0 0 0-.485-.248l-.52-.128a1.193 1.193 0 0 0-1.248.455l-.808 1.108c-.093.128-.16.273-.197.426l-.34 1.426c-.062.264-.034.54.082.785l.86 1.827a5.53 5.53 0 0 1 2.704-9.015Zm-1.225 4.458.24.06.091.128a1.193 1.193 0 0 0 2.13-.385l.083-.321.788.253a1.193 1.193 0 0 0 1.495-1.515l.937-.8a1.193 1.193 0 0 0 .413-.802 5.552 5.552 0 0 1 2 3.932l-.952-.479a1.193 1.193 0 0 0-1.342.187l-1.294 1.188a1.192 1.192 0 0 0-.378 1.016l.123 1.06a1.19 1.19 0 0 0 1.493 1.014l.61-.164.342.198a5.504 5.504 0 0 1-2.692 1.655 5.514 5.514 0 0 1-4.322-.628l.014-.014a1.193 1.193 0 0 0 .22-1.335l-.97-2.056.305-1.278.666-.914Zm5.686 2.432 1.05-.963 1.31.658a5.544 5.544 0 0 1-.441 1.224l-.531-.307a1.192 1.192 0 0 0-.906-.12l-.413.11-.07-.602Z"
        className="fill-current"
      />
    </svg>
  );
}
