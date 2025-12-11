import React from 'react';
import { Sparkles, Loader } from 'lucide-react';

interface AIInsightProps {
  insight: string | null;
  loading: boolean;
}

export const AIInsight: React.FC<AIInsightProps> = ({ insight, loading }) => {
  if (!process.env.API_KEY) return null; // Hide if no API key configured

  return (
    <div className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 dark:from-violet-900/40 dark:to-fuchsia-900/40 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-violet-500/30">
      <div className="flex items-center mb-2 space-x-2">
        <Sparkles className="text-violet-600 dark:text-violet-300 w-5 h-5" />
        <h3 className="font-bold text-violet-800 dark:text-violet-200">Hamro AI Insight</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
           <Loader className="animate-spin w-4 h-4" />
           <span>Thinking...</span>
        </div>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed italic">
          {insight || "Search for a city to get AI recommendations!"}
        </p>
      )}
    </div>
  );
};