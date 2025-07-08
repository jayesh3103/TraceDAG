import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { validateProductId } from '../../lib/utils';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );
    
    scannerRef.current = scanner;
    
    scanner.render(
      (decodedText) => {
        setIsScanning(false);
        if (validateProductId(decodedText)) {
          onScan(decodedText);
        } else {
          setError('Invalid QR code format. Please scan a valid TraceDAG product code.');
        }
      },
      (error) => {
        // Handle scan errors silently
        console.warn('QR scan error:', error);
      }
    );
    
    setIsScanning(true);
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScan]);
  
  const handleRetry = () => {
    setError(null);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    // Re-initialize scanner
    window.location.reload();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRetry} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        ) : (
          <>
            <div id="qr-reader" className="mb-4"></div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Position the QR code within the frame to scan
              </p>
              {isScanning && (
                <div className="flex items-center justify-center space-x-2 text-teal-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="text-sm">Scanning...</span>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};