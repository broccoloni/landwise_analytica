import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  optionsDetails?: React.ReactNode[]; // Updated to allow ReactNode for details
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
  optionsDetails = [], // Default is an empty array
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block z-10 ${className}`} ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className="flex items-center pl-4 pr-2 py-2 bg-gray-200 text-black rounded focus:outline-none"
      >
        <div className="flex justify-between items-start space-x-4">
          <span className="">{selected}</span>
          {(() => {
            const index = options.findIndex((option) => option === selected);
            return index >= 0 && optionsDetails[index] ? (
              <>{optionsDetails[index]}</>
            ) : null;
          })()}
        </div>
        <span className="flex justify-center items-center ml-2">
          <ChevronDown
            className={`h-5 w-5 transition-all ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 min-w-24 bg-white border border-gray-300 rounded shadow-lg mt-1">
          {options.map((option, index) => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 cursor-pointer hover:bg-medium hover:text-white border-b border-gray-300 ${
                index === options.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="flex justify-between items-start w-full space-x-4">
                <div className="">{option}</div>
                {optionsDetails.length > 0 && (
                  <>
                    {optionsDetails[index]}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
