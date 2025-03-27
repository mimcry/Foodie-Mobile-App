// ForgotPasswordSvg.tsx
import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const ForgotPasswordSvg = (props: SvgProps) => (
  <Svg
    width={288}
    height={288}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
      stroke="#4A5568"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ForgotPasswordSvg