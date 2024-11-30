import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Image from 'next/image';

export default function Contact() {
  return (
    <div className="flex-row px-40 py-20">
      <div className={`${roboto.className} font-bold text-4xl pb-8`}>
        Contact Us
      </div>
        
      <div className="flex">
        <div className="flex border-y border-gray-500 py-8 mx-2 w-full">
          <div className="ml-12">
            <Image
              src='/employees/aman.png'
              width={150}
              height={200}
              alt="Aman Bhullar"
              className="rounded-lg border border-gray-300 mb-2"
            />
          </div>
          <div className="ml-8 mr-12 space-y-2">
            <div className={`${raleway.className} text-xl`}>Aman Bhullar</div>
            <div className={`${roboto.className} text-lg`}>Co-Founder</div>
            <div className="">PhD Candidate - Statistics</div>
            <div className="flex">
              Email:
              <div className="ml-2 text-blue-700 hover:underline">
                <a href="mailto:pmcmilla@uoguelph.ca">bhullara@uoguelph.ca</a>
              </div>
            </div>          
          </div>
        </div>

        <div className="flex border-y border-gray-500 py-8 mx-2 w-full">
          <div className="ml-12">
            <Image
              src='/employees/patrick.png'
              width={150}
              height={200}
              alt="Patrick McMillan"
              className="rounded-lg border border-gray-300 mb-2"
            />
          </div>
          <div className="ml-8 mr-12 space-y-2">
            <div className={`${raleway.className} text-xl`}>Patrick McMillan</div>
            <div className={`${roboto.className} text-lg`}>Co-Founder</div>
            <div className="">PhD Candidate - Bioinformatics</div>
            <div className="flex">
              Email:
              <div className="ml-2 text-blue-700 hover:underline">
                <a href="mailto:pmcmilla@uoguelph.ca">pmcmilla@uoguelph.ca</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}