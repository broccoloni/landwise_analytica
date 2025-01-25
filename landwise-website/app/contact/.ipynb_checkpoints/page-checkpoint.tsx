import { roboto, raleway } from '@/ui/fonts';
import Image from 'next/image';

export default function Contact() {
  const employees = [
    {
      name: "Aman Bhullar",
      role: "Co-Founder",
      description: "PhD Candidate - Statistics",
      email: "bhullara@uoguelph.ca",
      image: "/employees/aman.png",
    },
    {
      name: "Patrick McMillan",
      role: "Co-Founder",
      description: "PhD Candidate - Bioinformatics",
      email: "pmcmilla@uoguelph.ca",
      image: "/employees/patrick.png",
    },
    {
      name: "Liam Graham",
      role: "Co-Founder",
      description: "MSc Computer Science, MSc Mathematics",
      email: "lgraham@landwiseanalytica.com",
      image: "/employees/liam.jpg",
    },
  ];
    
  return (
    <div className="flex-row px-40 py-20">
      <div className={`${roboto.className} font-bold text-4xl pb-8`}>
        Contact Us
      </div>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto justify-center items-start">
        {employees.map((person, index) => (
          <div
            key={index}
            className="flex border-y border-gray-500 py-8 mx-2 w-full bg-white h-lg" // Fixed height
          >
            <div className="ml-12 flex-shrink-0">
              <Image
                src={person.image}
                width={150}
                height={200}
                alt={person.name}
                className="rounded-lg border border-gray-300"
              />
            </div>
            <div className="ml-8 mr-12 space-y-4 flex flex-col justify-start">
              <div>
                <div className={`${raleway.className} text-xl mb-2`}>{person.name}</div>
                <div className={`${roboto.className} text-lg`}>{person.role}</div>
                <div className="">{person.description}</div>
              </div>
              <div className="flex">
                Email:
                <div
                  className="ml-2 text-blue-700 hover:underline truncate"
                  title={person.email}
                >
                  <a
                    href={`mailto:${person.email}`}
                    className=""
                  >
                    {person.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
