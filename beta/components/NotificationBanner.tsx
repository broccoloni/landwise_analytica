import React from 'react';
import { CircleAlert, CircleCheck, CircleX, Loader2 } from 'lucide-react';

type NotificationBannerProps = {
  type?: 'info' | 'success' | 'error' | 'loading';
  showIcon?: boolean;
  children: React.ReactNode;
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type = 'info',
  showIcon = true,
  children,
}) => {
  const colorSchemes = {
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      Icon: CircleAlert,
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      Icon: CircleCheck,
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      Icon: CircleX,
    },
    loading: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      Icon: Loader2,
    },
  };

  const { bg, text, Icon } = colorSchemes[type];

  return (
    <div className={`p-4 rounded-lg ${bg} ${text}`}>
      <div className={`flex items-center ${type === 'loading' && 'justify-center'}`}>
        {showIcon && <Icon size={48} className={`mr-4 ${type === 'loading' && 'animate-spin'}`} />}
        <div className="text-sm w-full">{children}</div>
      </div>
    </div>
  );
};

export default NotificationBanner;
