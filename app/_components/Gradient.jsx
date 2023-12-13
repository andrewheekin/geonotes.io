export default function Gradient() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          position: 'absolute',
          height: '300px',
          width: '100%',
          borderRadius: '50%',
          backgroundImage: 'radial-gradient(white, transparent)',
          filter: 'blur(50px)',
          content: '""',
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          zIndex: -20,
          height: '180px',
          width: '100%',
          backgroundImage: 'conic-gradient(#87CEEB, #ADD8E6)',
          filter: 'blur(50px)',
          content: '""',
        }}
      />
    </div>
  );
}
