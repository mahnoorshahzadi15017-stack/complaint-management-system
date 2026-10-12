import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

type CampusIllustrationProps = {
  height: number;
};

function CampusIllustration({height}: CampusIllustrationProps): React.JSX.Element {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 420 112"
      preserveAspectRatio="xMidYMax meet"
      accessibilityLabel="School campus illustration">
      <Path d="M0 92h420v12H0z" fill="#3B7BC0" />
      <Path d="m48 37 46-20 47 20H48Z" fill="#3C7CC2" />
      <Path d="M56 39h78v53H56z" fill="#3272B8" />
      <Path d="m153 43 57-29 58 29v49H153z" fill="#3272B8" />
      <Path d="M190 43h40v-19h-40z" fill="#3C7CC2" />
      <Path d="m210 27 6-10 6 10" fill="none" stroke="#3C7CC2" strokeWidth="4" />
      <Path d="m278 42 47-24 47 24H278Z" fill="#3C7CC2" />
      <Path d="M285 44h80v48h-80z" fill="#3272B8" />
      <Path d="M45 40h103M151 46h120M276 45h99" stroke="#3C7CC2" strokeWidth="4" />
      <Path
        d="M68 52h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8zm-38 17h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8zm-38 17h8v6h-8zm19 0h8v6h-8zm19 0h8v6h-8zm112-25h10v10h-10zm20 0h10v10h-10zm20 0h10v10h-10zm-50 18h10v10h-10zm20 0h10v10h-10zm20 0h10v10h-10zm68-29h9v9h-9zm19 0h9v9h-9zm-28 17h9v9h-9zm19 0h9v9h-9zm-19 17h9v9h-9zm19 0h9v9h-9z"
        fill="#3C7CC2"
      />
      <Rect x="202" y="74" width="17" height="18" fill="#3C7CC2" />
      <Path d="M12 91 24 68l12 23H12Zm372 0 12-23 12 23h-24Z" fill="#3C7CC2" />
    </Svg>
  );
}

export default CampusIllustration;
