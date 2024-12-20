import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({children, className = ''}: ContainerProps) => {
  return (
    <div className={`bg-white ${className} rounded-lg border p-8`}>
      {children}
    </div>
  );
};


export default Container;