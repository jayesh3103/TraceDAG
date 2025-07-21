import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerConfig, Html5QrcodeResult } from 'html5-qrcode';
import { Camera, CameraOff, RotateCcw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  isOpen,
  onClose,
  title = "QR Code Scanner",
  subtitle = "Position the QR code within the frame"
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementId = 'qr-scanner-container';

  useEffect(() => {
    if (isOpen && !showManualInput) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isOpen, showManualInput]);

  const initializeScanner = async () => {
    try {
      // Check camera permission
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state);

      if (permission.state === 'denied') {
        setError('Camera access denied. Please enable camera permissions or use manual input.');
        setShowManualInput(true);
        return;
      }

      const config: Html5QrcodeScannerConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
        supportedScanTypes: [],
      };

      scannerRef.current = new Html5QrcodeScanner(scannerElementId, config, false);
      
      scannerRef.current.render(
        (decodedText: string, result: Html5QrcodeResult) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage: string) => {
          // Handle scan errors silently - they're frequent during scanning
          console.debug('QR Scan error:', errorMessage);
        }
      );

      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Failed to initialize camera. Please try manual input.');
      setShowManualInput(true);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    setIsScanning(false);
    
    // Clear scanner
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }

    // Show success for 1 second then call onScan
    setTimeout(() => {
      onScan(decodedText);
      handleClose();
    }, 1500);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    setIsScanning(false);
    setScanResult(null);
    setError(null);
    setManualInput('');
    setShowManualInput(false);
    onClose();
  };

  const switchToManual = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    setIsScanning(false);
    setShowManualInput(true);
  };

  const switchToCamera = () => {
    setShowManualInput(false);
    setError(null);
    initializeScanner();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scanner Result */}
          {scanResult && (
            <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Scan Successful!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 break-all">
                      {scanResult}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Scanner Error
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scanner Container */}
          {!showManualInput && !scanResult && (
            <div className="mb-4">
              <div 
                id={scannerElementId}
                className="w-full rounded-lg overflow-hidden bg-black"
                style={{ minHeight: '300px' }}
              />
              
              {isScanning && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Camera className="w-4 h-4 animate-pulse" />
                    <span>Scanning for QR codes...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Input */}
          {showManualInput && !scanResult && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter QR Code Manually
              </label>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="QR-PROD-001 or PROD-001"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                For demo: try "PROD-001", "PROD-002", or "QR-PROD-001"
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!scanResult && (
            <div className="flex justify-between space-x-3">
              <div className="flex space-x-2">
                {!showManualInput ? (
                  <Button variant="outline" onClick={switchToManual} size="sm">
                    <CameraOff className="w-4 h-4 mr-2" />
                    Manual Input
                  </Button>
                ) : (
                  <Button variant="outline" onClick={switchToCamera} size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                {showManualInput && (
                  <Button 
                    onClick={handleManualSubmit}
                    disabled={!manualInput.trim()}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!showManualInput && !scanResult && !error && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Tips:</strong> Hold your device steady, ensure good lighting, and position the QR code within the frame. The scanner will automatically detect and process the code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};