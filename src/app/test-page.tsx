export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '48px', marginBottom: '20px' }}>
        ✅ It Works!
      </h1>
      <p style={{ fontSize: '24px', color: '#666' }}>
        If you can see this, the server is working correctly.
      </p>
      <a href="/" style={{ 
        display: 'inline-block', 
        marginTop: '30px', 
        padding: '15px 30px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '8px',
        fontSize: '18px'
      }}>
        Go to Homepage
      </a>
    </div>
  );
}

