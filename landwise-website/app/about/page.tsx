import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Container from '@/components/Container';
import Image from 'next/image';

export default function About() {
  return (
    <div className={`${roboto.className}`}>
      {/* About Section */}
      <div className="px-40 py-20">
        <div className="max-w-3xl">
          <div className={`${roboto.className} font-bold text-2xl mb-4`}>About Landwise Analytica</div>
          <div className={`${roboto.className} mb-2`}>
            At Landwise Analytica, we’re transforming the agriculture industry with fast, data-driven insights. Our innovative land assessment platform replaces costly, time-consuming methods, offering realtors, farmers, and insurers reliable insights into the soil, climate, and suitability of a piece land. With us, smarter agriculture decisions are just a few clicks away.
          </div>
          <div className={`${roboto.className}`}>
            We believe trust and innovation are the foundation of sustainable agriculture. That’s why our solutions leverage advanced analytics and vast data sets to ensure reliability and transparency.
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-40 pb-20">
        <div className=" max-w-3xl text-right ml-60">
          <div className={`${roboto.className} font-bold text-2xl mb-4`}>Our Mission</div>
          <div className={`${montserrat.className} italic text-xl`}>
            Modernizing agriculture with up-to-date land data and sustainable, data-driven insights for smarter decisions.
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="px-40 pt-20 pb-10 bg-gradient-to-r from-medium-yellow to-dark-blue dark:from-dark-blue dark:to-dark-gray-c text-white"
           style={{ borderTopLeftRadius: '10%', borderTopRightRadius: '10%' }}    
      >
        <div className={`${roboto.className} font-bold text-2xl mb-4`}>Our Solution</div>
        <div className="max-w-4xl">
          <p>
            At Landwise Analytica, we’ve developed an innovative land suitability assessment platform that combines advanced analytics with up-to-date data, allowing users to:
          </p>
          <ul className="list-inside list-disc mt-4 space-y-2">
            <li>Quickly compare farmlands for investment.</li>
            <li>Access accurate, up-to-date land suitability estimates.</li>
            <li>Save time by eliminating the need for manual data collection and costly soil testing.</li>
          </ul>
          <p className="mt-4">
            Whether you're a realtor, farmer, crop insurer, or agricultural mortgage provider, our reports give you the information you need to make the best possible decision.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-light-brown dark:bg-dark-gray-c">
        <div className="px-40 pt-10 pb-20 bg-gradient-to-r from-medium-yellow to-dark-blue dark:from-dark-blue dark:to-dark-gray-c text-white"
             style={{ borderBottomLeftRadius: '10%', borderBottomRightRadius: '10%' }}
        >
          <div className={`${roboto.className} font-bold text-2xl mb-10`}>Why Choose Us?</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Container className="text-black transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:text-white">
              <div className="font-semibold text-xl mb-2 dark:text-medium-green">Accurate Data</div>
              <p>
                Our reports are powered by cutting-edge data models that assess land viability based on climate, soil, and other key metrics.
              </p>
            </Container>
            <Container className="text-black transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:text-white">
              <div className="font-semibold text-xl mb-2 dark:text-medium-green">Time and Cost Efficiency</div>
              <p>
                By reducing the need for traditional methods like soil sampling, we save you both time and money.
              </p>
            </Container>
            <Container className="text-black transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:text-white">
              <div className="font-semibold text-xl mb-2 dark:text-medium-green">Scalable Solutions</div>
              <p>
                Whether you're dealing with a single plot of land or managing large portfolios, our platform can scale with your needs.
              </p>
            </Container>
            <Container className="text-black transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:text-white">
              <div className="font-semibold text-xl mb-2 dark:text-medium-green">Future-Proofing Agriculture</div>
              <p>
                With a strong focus on data-driven solutions, we’re helping the agricultural industry become more adaptable to changing climate conditions and market demands.
              </p>
            </Container>
            <Container className="text-black transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:text-white">
              <div className="font-semibold text-xl mb-2 dark:text-medium-green">Sustainability Focused</div>
              <p>
                Our solutions promote sustainable farming practices that help protect the environment while maximizing crop yields.
              </p>
            </Container>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-40 pt-20 bg-light-yellow dark:bg-dark-gray-c">
        <div className={`${roboto.className} font-bold text-2xl mb-8 text-center`}>Our Team</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto justify-center items-center">
          <div className="flex flex-col items-center">
            <Image
              src='/employees/liam.jpg'
              width={150}
              height={200}
              alt="Liam Graham"
              className="rounded-lg border border-gray-300 mb-2"
            />
            <div className={`${raleway.className} text-lg`}>Liam Graham</div>
            <div className={`${roboto.className} text-lg`}>Co-Founder</div>
            <div className="">MSc Computer Science, MSc Mathematics</div>
          </div>
            
          <div className="flex flex-col items-center">
            <Image
              src='/employees/patrick.png'
              width={150}
              height={200}
              alt="Patrick McMillan"
              className="rounded-lg border border-gray-300 mb-2"
            />
            <div className={`${raleway.className} text-lg`}>Patrick McMillan</div>
            <div className={`${roboto.className} text-lg`}>Co-Founder</div>
            <div className="">PhD Candidate - Bioinformatics</div>
          </div>

          <div className="flex flex-col items-center">
            <Image
              src='/employees/aman.png'
              width={150}
              height={200}
              alt="Aman Bhullar"
              className="rounded-lg border border-gray-300 mb-2"
            />
            <div className={`${raleway.className} text-lg`}>Aman Bhullar</div>
            <div className={`${roboto.className} text-lg`}>Co-Founder</div>
            <div className="">PhD Candidate - Statistics</div>
          </div>
            
        </div>
      </div>

      {/* Supporters Section */}
      <div className="px-40 py-20 bg-light-yellow dark:bg-dark-gray-c">
        <div className={`${roboto.className} font-bold text-2xl mb-8 text-center`}>Our Supporters</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 mx-auto justify-center items-center">
          <div className="flex justify-center items-center">
            <Image 
              src='/supporters/elevx.png'
              width={250}
              height={50}
              alt="ElevX Logo"
            />
          </div>
          <div className="flex justify-center items-center">
            <Image 
              src='/supporters/idea.png'
              width={250}
              height={50}
              alt="Idea Fund Logo"
            />
          </div>
          <div className="flex justify-center items-center">
            <Image 
              src='/supporters/bioenterprise.png'
              width={250}
              height={50}
              alt="Bioenterprise Logo"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
