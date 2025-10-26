export default function TestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#333' }}>
        ✅ Test Page Loaded Successfully
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
        The web app is running on port 3003
      </p>
      <a href="/" style={{ 
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#0066cc',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px'
      }}>
        Go to Home Page
      </a>
    </div>
  )
}
