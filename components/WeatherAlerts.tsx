import React, { useState } from 'react';
import { WeatherAlert } from '../types';
import { AlertTriangle, ShieldAlert, Info, X, ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  if (!alerts || alerts.length === 0) return null;

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));
  if (visibleAlerts.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedAlerts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-500/10 dark:bg-red-900/40',
          border: 'border-red-500',
          text: 'text-red-700 dark:text-red-300',
          icon: <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />,
          label: 'CRITICAL ALERT'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10 dark:bg-orange-900/40',
          border: 'border-orange-500',
          text: 'text-orange-700 dark:text-orange-300',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          label: 'WARNING'
        };
      default:
        return {
          bg: 'bg-blue-500/10 dark:bg-blue-900/40',
          border: 'border-blue-500',
          text: 'text-blue-700 dark:text-blue-300',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          label: 'ADVISORY'
        };
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {visibleAlerts.map(alert => {
        const styles = getSeverityStyles(alert.severity);
        const isExpanded = expandedAlerts.has(alert.id);

        return (
          <div 
            key={alert.id}
            className={`relative overflow-hidden rounded-2xl border-l-4 p-4 shadow-sm transition-all duration-300 ${styles.bg} ${styles.border}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{styles.icon}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      {styles.label}
                    </span>
                    <span className="text-[10px] opacity-50">•</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">
                      {alert.sender_name}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mt-0.5 ${styles.text}`}>
                    {alert.event}
                  </h4>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => toggleExpand(alert.id)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 pl-8 text-xs leading-relaxed animate-slide-up opacity-90">
                <p className={styles.text}>{alert.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};