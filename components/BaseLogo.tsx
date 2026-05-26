interface BaseLogoProps {
  size?: number
  className?: string
}

/**
 * Base chain logo - the official mark from base.org brand kit.
 * Blue (#0052FF) circle with white inverted arch / pedestal.
 */
export default function BaseLogo({ size = 24, className = '' }: BaseLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 111 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Base chain logo"
    >
      {/* Full blue circle */}
      <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
      {/* White arch/pedestal shape - the iconic Base mark */}
      <path
        d="M55.5 16C33.633 16 16 33.633 16 55.5S33.633 95 55.5 95 95 77.367 95 55.5 77.367 16 55.5 16Zm0 63c-11.598 0-21-9.402-21-21s9.402-21 21-21 21 9.402 21 21-9.402 21-21 21Z"
        fill="white"
      />
    </svg>
  )
}
