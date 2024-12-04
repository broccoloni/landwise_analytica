import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[]; // Array of step names
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepNames }) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full h-16">
      {/* Step Names */}
      {/* <div className="flex justify-between mb-4">
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`absolute -translate-x-1/2 text-sm font-medium text-center ${
              currentStep - 1 === index ? 'text-dark-blue' : 'text-gray-500'
            }`}
            style={{ width: `${100 / totalSteps}%` }}
          >
            {name}
          </div>
        ))}
      </div> */}

      {/* Progress Bar */}
      <div className="relative flex items-center">
        {/* Progress Track */}
        <div className="w-full bg-gray-200 h-2 rounded-full relative">
          <div
            className="bg-dark-blue h-2 rounded-full absolute left-0 top-0 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Dots */}
        {stepNames.map((_, index) => (
          <div
            key={index}
            className={`absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 ${
              currentStep - 1 >= index ? 'bg-dark-green border-dark-green' : 'bg-gray-300 border-gray-200'
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
              currentStep - 1 === index ? 'text-dark-blue' : 'text-gray-500'
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
