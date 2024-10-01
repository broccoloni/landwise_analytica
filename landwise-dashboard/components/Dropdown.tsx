import React, { useRef, useEffect, useState } from "react";

const Dropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block z-100" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 bg-gray-200 text-black rounded focus:outline-none"
      >
        {selected}
        <span className="flex justify-center items-center ml-2 pl-2">
          <span className="w-0 h-0 border-l-4 border-l-transparent border-t-4 border-t-black border-r-4 border-r-transparent"></span>
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
              className={`p-2 cursor-pointer hover:bg-accent-medium hover:text-white border-b border-gray-300 ${index === options.length - 1 ? 'border-b-0' : ''}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
