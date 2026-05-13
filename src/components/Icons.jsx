function Svg({ children, size = 18, title, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function GearIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.8 1.8 0 0 0 .36 1.97l.04.04a2 2 0 0 1-1.42 3.42h-.05a1.8 1.8 0 0 0-1.7 1.2 2 2 0 0 1-1.9 1.37h-.08a2 2 0 0 1-1.9-1.37 1.8 1.8 0 0 0-1.7-1.2h-.05a2 2 0 0 1-1.42-3.42l.04-.04a1.8 1.8 0 0 0 .36-1.97 1.8 1.8 0 0 0-.36-1.97l-.04-.04a2 2 0 0 1 1.42-3.42h.05a1.8 1.8 0 0 0 1.7-1.2A2 2 0 0 1 12 4h.08a2 2 0 0 1 1.9 1.37 1.8 1.8 0 0 0 1.7 1.2h.05a2 2 0 0 1 1.42 3.42l-.04.04a1.8 1.8 0 0 0-.36 1.97Z" />
    </Svg>
  );
}

export function PackageIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 7.2 12 3l8.5 4.2v9.6L12 21l-8.5-4.2V7.2Z" />
      <path d="M12 3v8.2" />
      <path d="M3.5 7.2 12 11.4l8.5-4.2" />
      <path d="M7.25 5.6 16.75 10" />
    </Svg>
  );
}

export function PlayIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 5.8v12.4L18.6 12 8 5.8Z" />
    </Svg>
  );
}

export function PauseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 5.8v12.4" />
      <path d="M17 5.8v12.4" />
    </Svg>
  );
}

export function RefreshIcon(props) {
  return (
    <Svg {...props}>
      <path d="M19 7v4h-4" />
      <path d="M5 17v-4h4" />
      <path d="M18.2 9.8A8 8 0 0 0 6.2 7.6L5 11" />
      <path d="M5.8 14.2A8 8 0 0 0 17.8 16.4L19 13" />
    </Svg>
  );
}

export function WarningIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 4.6 21 19H3L12 4.6Z" />
      <path d="M12 9v4.8" />
      <circle cx="12" cy="16.8" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function SuccessIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M8.2 12.2 10.7 14.7 15.8 9.6" />
    </Svg>
  );
}

export function InfoIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 10.3v5.7" />
      <path d="M12 7.4h.01" />
    </Svg>
  );
}

export function RouteIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 17c2.8 0 4.2-2.1 5.6-4.1C12 10.6 13.2 8.8 16 8.8H19" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8.8" r="1.5" fill="currentColor" stroke="none" />
      <path d="M18 6.5 20.5 9 18 11.5" />
    </Svg>
  );
}
