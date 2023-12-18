export default function Gradient() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[300px] w-full rounded-full bg-radial-gradient blur-50 z-[-1]" />
      <div className="absolute top-0 left-0 h-[180px] w-full bg-conic-gradient blur-50 z-[-20]" />
    </div>
  );
}
