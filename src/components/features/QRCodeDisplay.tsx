import React from 'react';
import { QrCode, Download, Copy } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  value, 
  size = 200, 
  title = 'QR Code' 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    // In a real app, you'd show a toast notification
    alert('QR code value copied to clipboard!');
  };

  const downloadQR = () => {
    // In a real app, you'd generate and download the actual QR code image
    alert('QR code download would be triggered here');
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      
      {/* QR Code Placeholder */}
      <div 
        className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 break-all px-2">{value}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={downloadQR}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};