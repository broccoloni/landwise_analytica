import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownMenuProps {
  title: string;
  options: { label: string; path: string }[];
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, options, className='' }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Dropdown Trigger */}
      <div className="flex items-center p-2 cursor-pointer">
        <span className="text-left text-lg">{title}</span>
        <ChevronDown className="w-5 h-5 ml-2" />
      </div>

      {/* Dropdown Menu */}
      <ul className="absolute text-md left-0 top-full hidden group-hover:block min-w-max bg-white border border-gray-300 text-black rounded shadow-lg mt-0 z-10">
        {options.map((option) => (
          <li
            key={option.path}
            className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200 hover:text-black"
          >
            <Link href={option.path}>{option.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
