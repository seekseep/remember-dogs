interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

export function GameButton({ onClick, children }: Props) {
  return (
    <button
      className="mt-4 px-12 py-4 text-xl font-bold text-white bg-orange rounded-2xl hover:bg-orange-dark active:scale-95 transition-all cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
