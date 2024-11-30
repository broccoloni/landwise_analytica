import React from "react";
import Link from "next/link";

interface ListOfLinkProps {
  title: string;
  links: { label: string; path: string }[];
  className?: string;
}

const ListOfLinks: React.FC<ListOfLinkProps> = ({ title, links, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Section Title */}
      <div className="text-lg font-bold mb-3">{title}</div>

      {/* List of Links */}
      <ul className="space-y-2">
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
