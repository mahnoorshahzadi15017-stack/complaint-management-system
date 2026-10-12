import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

type BrandMarkProps = {
  size: number;
};

function BrandMark({size}: BrandMarkProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 240" accessibilityLabel="Verified complaint shield">
      <Path
        d="M110 9c25 15 52 23 91 28v79c0 53-34 91-91 116C53 207 19 169 19 116V37c39-5 66-13 91-28Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="12"
      />
      <Path
        d="M110 30c23 12 46 19 74 23v63c0 42-25 72-74 95-49-23-74-53-74-95V53c28-4 51-11 74-23Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        opacity="0.5"
      />
      <Rect x="64" y="57" width="91" height="117" rx="15" fill="none" stroke="#FFFFFF" strokeWidth="9" />
      <Rect x="87" y="48" width="46" height="19" rx="8" fill="#FFFFFF" />
      <Path
        d="M81 95h57M81 119h57M81 143h35"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Circle cx="155" cy="158" r="29" fill="#FFFFFF" />
      <Path
        d="m141 158 10 10 19-21"
        fill="none"
        stroke="#19488E"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BrandMark;
