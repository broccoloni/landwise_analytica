import { Printer } from 'lucide-react';

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      className="px-4 py-2 bg-medium-brown text-white rounded flex justify-center items-center hover:opacity-75"
      onClick={handlePrint}
    >
      <Printer className="w-5 h-5 mr-2" /> Print
    </button>
  );
};

export default PrintButton;
