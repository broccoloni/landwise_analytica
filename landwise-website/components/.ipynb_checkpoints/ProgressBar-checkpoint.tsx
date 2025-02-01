import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[]; // Array of step names
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepNames }) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full h-16 px-4">
      {/* Progress Bar */}
      <div className="relative flex items-center">
        {/* Progress Track */}
        <div className="w-full bg-gray-200 dark:bg-dark-gray-b h-2 rounded-full relative">
          <div
            className="bg-dark-blue dark:bg-dark-green h-2 rounded-full absolute left-0 top-0 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Dots */}
        {stepNames.map((_, index) => (
          <div
            key={index}
            className={`absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 ${
              currentStep - 1 >= index ? 'bg-dark-green border-dark-green dark:bg-medium-green dark:border-medium-green' : 'bg-gray-300 border-gray-200 dark:bg-dark-gray-c dark:border-dark-gray-d'
            }`}
            style={{
              left: `${(index / (totalSteps - 1)) * 100}%`,
              top: '50%',
            }}
          ></div>
        ))}

        {/* Step Names */}
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`absolute w-16 -translate-x-1/2 mt-4 text-sm font-medium text-center ${
              currentStep - 1 === index ? 'text-dark-blue dark:text-white' : 'text-gray-500 dark:text-white'
            }`}
            style={{
              left: `${(index / (totalSteps - 1)) * 100}%`,
              top: '50%',
            }}
          >{name}</div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
