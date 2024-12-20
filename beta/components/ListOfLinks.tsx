import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ListOfLinkProps {
  title: string;
  links: { label: string; path: string }[];
  className?: string;
}

const ListOfLinks: React.FC<ListOfLinkProps> = ({ title, links, className='' }) => {
  // State to toggle visibility of links
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className={`flex flex-col ${className} py-3 border-y sm:border-none`}>
      {/* Section Title */}
      <div
        className={`text-lg font-bold cursor-pointer flex justify-between items-center mx-4 sm:mx-0 ${isOpen ? "mb-2" : "mb-0"} sm:mb-2`}
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        <span className="sm:hidden">
          {/* Dropdown arrow */}
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </span>
      </div>

      {/* List of Links */}
      <ul
        className={`space-y-2 transition-all duration-300 ${
          isOpen ? "max-h-screen mb-2" : "max-h-0 overflow-hidden mb-0"
        } sm:max-h-none sm:overflow-visible mx-4 sm:mx-0`}
      >
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className="text-sm text-white hover:text-light-brown hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOfLinks;
