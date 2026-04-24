interface Props {
  duration: number;
}

export function TimerBar({ duration }: Props) {
  return (
    <div
      className="w-full bg-gray-200 overflow-hidden"
      style={{ height: "1.5rem", borderRadius: "1rem" }}
    >
      <div
        className="h-full"
        style={{
          borderRadius: "1rem",
          animation: `timer-shrink ${duration}s linear forwards, timer-color ${duration}s linear forwards`,
        }}
      />
    </div>
  );
}
