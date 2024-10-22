import { raleway } from '@/ui/fonts';
import Link from 'next/link';
import PlantInHandIcon from '@/components/PlantInHandIcon';

const Header = () => {
  return (
    <div className="w-full bg-accent py-6">
      <Link className="" href="/">
        <div className="flex justify-center items-center text-center">
          <div className="flex justify-center mr-2">
            <PlantInHandIcon className="" height={48} width={48} />
          </div>
          <p className={`${raleway.className} font-medium text-white text-center text-3xl`}>
            LANDWISE ANALYTICA
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Header;
