import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export type AppIconName =
  | 'check'
  | 'chevronDown'
  | 'chevronLeft'
  | 'clock'
  | 'close'
  | 'document'
  | 'eye'
  | 'eyeOff'
  | 'menu'
  | 'plus'
  | 'refresh';

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
};

function AppIcon({name, size = 24, color = '#1A202C'}: AppIconProps): React.JSX.Element {
  const common = {
    fill: 'none' as const,
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      {name === 'document' ? (
        <>
          <Path {...common} d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <Path {...common} d="M14 3v6h5M9 13h6M9 17h6" />
        </>
      ) : name === 'clock' ? (
        <>
          <Circle {...common} cx="12" cy="12" r="9" />
          <Path {...common} d="M12 7v5l3 2" />
        </>
      ) : name === 'refresh' ? (
        <Path {...common} d="M20 7v5h-5M4 17v-5h5m10.5-2A7.5 7.5 0 0 0 6.1 7.1L4 9m16 6-2.1 1.9A7.5 7.5 0 0 1 5.5 14" />
      ) : name === 'check' ? (
        <Path {...common} d="m5 12 4 4L19 6" />
      ) : name === 'menu' ? (
        <Path {...common} d="M4 6h16M4 12h16M4 18h16" />
      ) : name === 'chevronDown' ? (
        <Path {...common} d="m6 9 6 6 6-6" />
      ) : name === 'chevronLeft' ? (
        <Path {...common} d="m15 18-6-6 6-6" />
      ) : name === 'plus' ? (
        <Path {...common} d="M12 5v14M5 12h14" />
      ) : name === 'eye' ? (
        <>
          <Path {...common} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <Circle {...common} cx="12" cy="12" r="3" />
        </>
      ) : name === 'eyeOff' ? (
        <>
          <Path {...common} d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <Path {...common} d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8.1 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.3 3.3-.7" />
        </>
      ) : (
        <Path {...common} d="m6 6 12 12M18 6 6 18" />
      )}
    </Svg>
  );
}

export default AppIcon;
