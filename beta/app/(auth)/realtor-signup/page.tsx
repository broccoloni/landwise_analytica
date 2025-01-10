import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SignUpForm from './signUpForm';
import { raleway, roboto } from '@/ui/fonts';
import Container from '@/components/Container';

export default async function Login() {
  const session = await getServerSession();
    
  return (
    <>
      <div className="flex flex-col gap-y-[16px] text-black">
        <div className="max-w-sm">
          <div className={`mb-1 text-4xl text-dark-blue`}>Realtor Sign Up</div>
          <div className="bg-blue-50 text-blue-800 py-2 px-4 mb-4 rounded-md">
            Our pilot program is currently in operation. Please only create an account if you are an approved member of the pilot program.
          </div>
          <SignUpForm />
          <div className={`${roboto.className} mt-6 text-black`}>
            Already Have an Account?{' '}
            <Link href={`/realtor-login`} className={`font-semibold text-dark-blue hover:underline`}>
              Log In{' '}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}