import React from 'react';
import styles from './Arrow.module.css';

interface ArrowProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Arrow(props: ArrowProps) {
  const { className = '', ...other } = props;
  return (
    <div
      {...other}
      className={[className,styles['arrow-btn']].filter(Boolean).join(' ')}
      role="button"
    >
      <svg viewBox="0 0 1024 1024" width="24" height="24">
        <path
          d="M373.888 576h276.224c9.322667 0 14.293333 11.178667 9.173333 18.773333l-1.258666 1.557334-138.112 146.858666a10.709333 10.709333 0 0 1-14.293334 1.365334l-1.536-1.365334-138.112-146.858666c-6.592-6.997333-2.666667-18.645333 5.973334-20.16l1.941333-0.170667h276.224-276.224z m146.026667-295.189333l138.112 146.858666c7.04 7.509333 2.069333 20.330667-7.914667 20.330667H373.888c-9.984 0-14.976-12.821333-7.914667-20.330667l138.112-146.858666a10.730667 10.730667 0 0 1 15.829334 0z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}