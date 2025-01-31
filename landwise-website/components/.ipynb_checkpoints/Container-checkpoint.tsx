import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({children, className = 'bg-white dark:bg-gray-700'}: ContainerProps) => {
  return (
    <div className={`${className} rounded-lg border p-8`}>
      {children}
    </div>
  );
};


export default Container;