import React, { useState } from 'react';
import { DollarSign, TrendingUp, Shield, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Product } from '../../types';

interface DeFiPanelProps {
  product: Product;
}

export const DeFiPanel: React.FC<DeFiPanelProps> = ({ product }) => {
  const [loanAmount, setLoanAmount] = useState(75000);
  const [duration, setDuration] = useState(30);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCollateralValue = () => {
    // Mock calculation based on product status, checkpoints, and sustainability
    const baseValue = 375000; // ₹3.75 Lakh base value
    const statusMultiplier = product.status === 'verified' ? 1.2 : product.status === 'suspicious' ? 0.8 : 1.0;
    const checkpointBonus = product.checkpoints.length * 7500; // ₹7,500 per checkpoint
    const sustainabilityBonus = (product.sustainabilityScore / 100) * 37500; // Up to ₹37,500
    
    return Math.round(baseValue * statusMultiplier + checkpointBonus + sustainabilityBonus);
  };

  const collateralValue = calculateCollateralValue();
  const maxLoan = Math.round(collateralValue * 0.7); // 70% LTV
  const interestRate = product.status === 'verified' ? 5.5 : 8.5;

  const handleApplyLoan = async () => {
    setIsCalculating(true);
    // Simulate loan processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCalculating(false);
    alert(`Loan application submitted! Amount: $${loanAmount}, Rate: ${interestRate}%`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            DeFi Collateral Financing
          </h3>
          <Badge variant={product.status === 'verified' ? 'success' : 'warning'}>
            {product.status === 'verified' ? 'Eligible' : 'Limited'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Collateral Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Collateral Value
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ₹{collateralValue.toLocaleString()}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Max Loan (70% LTV)
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ₹{maxLoan.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Interest Rate
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {interestRate}% APR
                </p>
              </div>
              <Calculator className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Loan Application */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Apply for Loan
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                max={maxLoan}
                min={100}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ₹{maxLoan.toLocaleString()}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (days)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Principal:</span>
                <span className="font-medium">₹{loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Interest:</span>
                <span className="font-medium">
                  ₹{Math.round((loanAmount * interestRate / 100 * duration / 365)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Repayment:</span>
                <span className="font-medium">
                  ₹{(loanAmount + Math.round((loanAmount * interestRate / 100 * duration / 365))).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Collateral Required:</span>
                <span className="font-medium">₹{Math.round(loanAmount / 0.7).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleApplyLoan}
            loading={isCalculating}
            disabled={loanAmount > maxLoan || loanAmount < 100}
            className="w-full"
          >
            Apply for Loan
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            By applying, you agree to use your verified product NFT as collateral
          </p>
        </div>
      </CardContent>
    </Card>
  );
};