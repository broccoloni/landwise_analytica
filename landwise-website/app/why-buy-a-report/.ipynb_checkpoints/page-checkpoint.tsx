import { montserrat, roboto, raleway } from '@/ui/fonts';
import Container from '@/components/Container';
import Link from 'next/link';

export default function WhyBuyReport() {
  return (
    <div className={`${roboto.className} text-black dark:text-white`}>
      {/* Hero Section */}
      <div className="px-40 pt-20 pb-10">
        <div className="">
          <div className={`${roboto.className} font-bold text-4xl mb-6`}>
            Why Buy a Report?
          </div>
          <p className="text-lg">
            Landwise Analytica reports revolutionize land suitability assessments by replacing expert-based evaluations with up-to-date, data-driven insights. We bring speed, precision, and objectivity to decision-making, saving you time and resources.
          </p>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="px-40 py-10">
        <div className={`${roboto.className} font-bold text-2xl mb-10 text-center text-dark-blue dark:text-medium-green`}>
          Key Benefits of Our Reports
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <Container className="transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600">
            <div className="font-semibold text-xl mb-2 text-medium-brown dark:text-medium-green">Data-Driven Objectivity</div>
            <p>
              Traditional methods often rely on expert opinions, which are prone to human bias. Our reports eliminate this risk by using our data-driven models and climate projections.
            </p>
          </Container>
          <Container className="transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600">
            <div className="font-semibold text-xl mb-2 text-medium-brown dark:text-medium-green">Speed and Efficiency</div>
            <p>
              Avoid the delays of manual data collection and soil sampling. With our platform, you get up-to-date land suitability evaluations at the click of a button.
            </p>
          </Container>
          <Container className="transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600">
            <div className="font-semibold text-xl mb-2 text-medium-brown dark:text-medium-green">Accurate and Up-to-Date Data</div>
            <p>
              Many of the currently available data sources are outdated, use broad classifications, and  have low spatial resolution. Our reports deliver precise, high-resolution, and current insights to support informed decisions.
            </p>
          </Container>
          <Container className="transition-transform transform hover:scale-105 duration-200 p-8 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600">
            <div className="font-semibold text-xl mb-2 text-medium-brown dark:text-medium-green">Sustainability Focused</div>
            <p>
              Our solutions empower farmers and investors to make environmentally responsible decisions, ensuring long-term viability and knowledgeable crop selection.
            </p>
          </Container>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-40 py-20 bg-light-yellow dark:bg-dark-gray-c">
        <div className="text-center">
          <div className={`${roboto.className} font-bold text-2xl mb-4`}>
            Ready to Make Smarter Land Decisions?
          </div>
          <div className="flex justify-center">
            <p className="mb-6 max-w-3xl">
              Discover how our reports can transform your approach to land assessment. Say goodbye to traditional methods and embrace the future of agriculture with Landwise Analytica.
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-medium-brown dark:bg-medium-green rounded-lg px-4 py-2 w-64 text-center hover:opacity-75">
              <Link
                href="get-a-report"
                className="text-md text-white"
              >
                Get Your Report Now
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/view-sample-report"
              className="text-md text-black hover:text-medium-brown dark:text-white dark:hover:text-medium-green hover:underline"
            >
              View a Sample Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
