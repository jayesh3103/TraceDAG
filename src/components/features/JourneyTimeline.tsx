import React from 'react';
import { MapPin, Clock, User, FileText } from 'lucide-react';
import { Checkpoint } from '../../types';

interface JourneyTimelineProps {
  checkpoints: Checkpoint[];
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ checkpoints }) => {
  if (!checkpoints.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No checkpoints recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Product Journey
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        
        {checkpoints.map((checkpoint, index) => (
          <div key={checkpoint.id} className="relative flex items-start space-x-4 pb-8">
            {/* Timeline dot */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full border-4 border-white dark:border-gray-800 shadow-lg">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {checkpoint.location}
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(checkpoint.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 mr-2" />
                      {checkpoint.handler}
                    </div>
                    {checkpoint.notes && (
                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{checkpoint.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded">
                    Verified
                  </span>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    TX: {checkpoint.transactionHash.slice(0, 10)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};