import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownMenuProps {
  title: string;
  options: { label: string; path: string }[];
  onLinkClick?: () => void;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, options, onLinkClick, className='' }) => {
  return (
    <div className={`relative inline-block group ${className} z-0`}>
      {/* Dropdown Trigger */}
      <div className="flex items-center p-2 cursor-pointer z-0">
        <span className="text-left text-lg">{title}</span>
        <ChevronDown className="w-5 h-5 ml-2 group-hover:rotate-180 transition-all" />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute flex-row text-md left-0 top-full hidden group-hover:block min-w-max bg-white dark:bg-dark-gray-d border border-gray-300 dark:border-dark-gray-c text-black dark:text-white rounded shadow-lg mt-0 z-20">
        {options.map((option) => (
          <Link 
            key={option.path}
            href={option.path}
            onClick={onLinkClick}
            className="w-full block py-2 px-4 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-gray-c hover:text-black dark:hover:text-medium-green border-b border-gray-200 dark:border-dark-gray-c"
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
