import { MoveUp } from 'lucide-react';

const WindDirectionDisplay = ({ windDirection, windDirectionStdDev }) => {    
  const roundedWindDirection = Math.round(windDirection);
  const roundedStdDev = Math.round(windDirectionStdDev);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute">
        <MoveUp
          className="text-blue-600 h-40 w-40 pb-20"
          style={{ 
            transform: `rotate(${roundedWindDirection}deg)`, 
          }}
        />
      </div>
      <div className="absolute">
        <MoveUp
          className="text-blue-400 h-20 w-20 pb-10"
          style={{ 
            transform: `rotate(${roundedWindDirection + roundedStdDev}deg)`, 
          }}
        />
      </div>
      <div className="absolute">
        <MoveUp
          className="text-blue-400 h-20 w-20 pb-10"
          style={{ 
            transform: `rotate(${roundedWindDirection - roundedStdDev}deg)`, 
          }}
        />
      </div>
    </div>
  );
};

export default WindDirectionDisplay;
