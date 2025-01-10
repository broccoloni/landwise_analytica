import Link from 'next/link';
import Form from './form';
import { raleway, roboto } from '@/ui/fonts';

export default async function Login() {    
  return (
    <div className="">
      <div className="flex flex-col gap-y-[16px] text-black">
        <div className={`mb-1 text-4xl text-dark-blue`}>Realtor Log In</div>
        <Form />
      </div>
      <div className={`${roboto.className} mt-6 text-black`}>
        New User?{' '}
        <Link href={`/realtor-signup`} className={`font-semibold text-dark-blue hover:underline`}>
          Become a Realtor Member{' '}
        </Link>
      </div>
    </div>
  );
}