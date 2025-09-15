import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config.js';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Test 1: Try to read from a collection
      const testCollection = collection(db, 'test');
      const snapshot = await getDocs(testCollection);
      
      setConnectionStatus('Connected ✅');
      setTestResult({
        status: 'success',
        message: 'Firebase connection successful',
        documentsCount: snapshot.docs.length
      });
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      setConnectionStatus('Failed ❌');
      setTestResult({
        status: 'error',
        message: error.message,
        code: error.code
      });
    }
  };

  const testWriteOperation = async () => {
    try {
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        message: 'Test document from VARUNA platform',
        timestamp: serverTimestamp(),
        testId: Date.now()
      });
      
      setTestResult(prev => ({
        ...prev,
        writeTest: {
          status: 'success',
          message: 'Write operation successful',
          documentId: docRef.id
        }
      }));
    } catch (error) {
      console.error('Firebase write test failed:', error);
      setTestResult(prev => ({
        ...prev,
        writeTest: {
          status: 'error',
          message: error.message,
          code: error.code
        }
      }));
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Firebase Connection Test</h3>
      <p><strong>Status:</strong> {connectionStatus}</p>
      
      {testResult && (
        <div>
          <h4>Test Results:</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Read Test:</strong> 
            <span style={{ 
              color: testResult.status === 'success' ? 'green' : 'red',
              marginLeft: '10px'
            }}>
              {testResult.status === 'success' ? '✅' : '❌'} {testResult.message}
            </span>
            {testResult.documentsCount !== undefined && (
              <div>Documents found: {testResult.documentsCount}</div>
            )}
          </div>
          
          {testResult.writeTest && (
            <div>
              <strong>Write Test:</strong>
              <span style={{ 
                color: testResult.writeTest.status === 'success' ? 'green' : 'red',
                marginLeft: '10px'
              }}>
                {testResult.writeTest.status === 'success' ? '✅' : '❌'} {testResult.writeTest.message}
              </span>
              {testResult.writeTest.documentId && (
                <div>Document ID: {testResult.writeTest.documentId}</div>
              )}
            </div>
          )}
          
          <button 
            onClick={testWriteOperation}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Write Operation
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;

