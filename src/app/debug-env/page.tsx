"use client";

export default function DebugEnv() {
  // Variables del cliente (NEXT_PUBLIC_*)
  const publicVar = process.env.NEXT_PUBLIC_API_BASE_URL;
  const publicVarHola = process.env.NEXT_PUBLIC_API_KEY;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Debug</h1>
      <div>
        <h2>Client-side (NEXT_PUBLIC_*)</h2>
        <p>NEXT_PUBLIC_API_BASE_URL: {publicVar || 'undefined'}</p>
        <p>NEXT_PUBLIC_API_KEY: {publicVarHola || 'undefined'}</p>
        <p>Type: {typeof publicVar}</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h3>Raw Check</h3>
        <pre>{JSON.stringify({ publicVar }, null, 2)}</pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Browser Console Check</h3>
        <button onClick={() => {
          console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
          alert(`Value: ${process.env.NEXT_PUBLIC_API_URL || 'undefined'}`);
        }}>
          Log to Console
        </button>
      </div>
    </div>
  );
}