import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import PlantInHandIcon from '@/components/PlantInHandIcon';

const Header = () => {
  return (
    <div className={`w-full bg-accent py-4 ${raleway.className}`}>
      <Link href="/">
        <div className="flex justify-center items-center text-center">
          <div className="flex justify-center mr-4">
            <PlantInHandIcon className="" height={56} width={56} />
          </div>
          <div className={` font-medium text-white text-center text-4xl`}>
            LANDWISE ANALYTICA
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Header;
