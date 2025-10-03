'use client';

import { useState } from 'react';

interface TestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  timestamp: string;
}

export default function TestAPIPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(name);
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      setResults(prev => [...prev, {
        endpoint: name,
        success: data.success !== false,
        data: data,
        duration,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setResults(prev => [...prev, {
        endpoint: name,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(null);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>🧪 API Testing Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <button
          onClick={() => testEndpoint('/api/test/config', 'Config Check')}
          disabled={loading !== null}
          style={{
            padding: '15px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading === 'Config Check' ? '⏳ Testing...' : '🔧 Test Config'}
        </button>

        <button
          onClick={() => testEndpoint('/api/test/speakers', 'Speakers API')}
          disabled={loading !== null}
          style={{
            padding: '15px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading === 'Speakers API' ? '⏳ Testing...' : '🎤 Test Speakers'}
        </button>

        <button
          onClick={() => testEndpoint('/api/test/chats', 'Chats API')}
          disabled={loading !== null}
          style={{
            padding: '15px 20px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading === 'Chats API' ? '⏳ Testing...' : '💬 Test Chats'}
        </button>

        <button
          onClick={clearResults}
          disabled={loading !== null || results.length === 0}
          style={{
            padding: '15px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || results.length === 0) ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: (loading || results.length === 0) ? 0.6 : 1
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      <div>
        <h2 style={{ marginBottom: '20px', color: '#555' }}>
          Test Results ({results.length})
        </h2>
        
        {results.length === 0 ? (
          <p style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            color: '#6b7280'
          }}>
            No tests run yet. Click a button above to start testing.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ margin: 0, color: result.success ? '#065f46' : '#991b1b' }}>
                    {result.success ? '✅' : '❌'} {result.endpoint}
                  </h3>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {result.duration}ms
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  marginBottom: '10px'
                }}>
                  {new Date(result.timestamp).toLocaleString()}
                </div>

                {result.error && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '4px',
                    marginTop: '10px',
                    color: '#991b1b',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                {result.data && (
                  <details style={{ marginTop: '10px' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      color: '#374151',
                      padding: '5px'
                    }}>
                      View Response Data
                    </summary>
                    <pre style={{
                      marginTop: '10px',
                      padding: '15px',
                      backgroundColor: '#1f2937',
                      color: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '12px',
                      maxHeight: '300px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}