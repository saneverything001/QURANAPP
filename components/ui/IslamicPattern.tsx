import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { useApp } from '@/context/AppContext';

interface IslamicPatternProps {
  size?: number;
  color?: string;
  opacity?: number;
}

export function IslamicStar({ size = 80, color, opacity = 0.15 }: IslamicPatternProps) {
  const { theme } = useApp();
  const c = color ?? theme.gold;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  const points = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const innerAngle = angle + Math.PI / 8;
    const innerR = r * 0.45;
    return {
      outer: { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) },
      inner: { x: cx + innerR * Math.cos(innerAngle), y: cy + innerR * Math.sin(innerAngle) },
    };
  });

  const d = points.map((p, i) => {
    const next = points[(i + 1) % points.length];
    return `${i === 0 ? 'M' : 'L'} ${p.outer.x} ${p.outer.y} L ${p.inner.x} ${p.inner.y}`;
  }).join(' ') + ' Z';

  return (
    <Svg width={size} height={size}>
      <G opacity={opacity}>
        <Path d={d} fill={c} />
        <Circle cx={cx} cy={cy} r={r * 0.2} fill={c} />
      </G>
    </Svg>
  );
}

export function GeometricAccent({ size = 200, color, opacity = 0.06 }: IslamicPatternProps) {
  const { theme } = useApp();
  const c = color ?? theme.gold;

  return (
    <Svg width={size} height={size}>
      <G opacity={opacity}>
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          const x = size / 2 + (size * 0.3) * Math.cos(angle);
          const y = size / 2 + (size * 0.3) * Math.sin(angle);
          return <Circle key={i} cx={x} cy={y} r={size * 0.15} fill="none" stroke={c} strokeWidth={2} />;
        })}
        <Circle cx={size / 2} cy={size / 2} r={size * 0.15} fill="none" stroke={c} strokeWidth={2} />
      </G>
    </Svg>
  );
}
