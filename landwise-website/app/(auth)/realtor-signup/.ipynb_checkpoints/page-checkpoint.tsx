import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignUpForm from './signUpForm';
import { raleway, roboto } from '@/ui/fonts';
import Container from '@/components/Container';
import NotificationBanner from '@/components/NotificationBanner';

export default async function Signup() {

  return (
    <div className="mx-auto max-w-md space-y-4">
      <NotificationBanner type='info'>
        Our pilot program is currently in operation. Please only create an account if you are an approved member of the pilot program.
      </NotificationBanner>
        
      <Container className="bg-white no-scrollbar mx-auto rounded-xl px-5 py-5 bg-primary text-dark-brown dark:bg-dark-gray-c dark:text-white">
        <div className="flex flex-col gap-y-[16px] text-black">
          <div className="max-w-sm">
            <div className={`mb-4 text-4xl text-dark-blue dark:text-medium-green`}>Realtor Sign Up</div>
            <SignUpForm />
            <div className={`${roboto.className} mt-6 text-black dark:text-white`}>
              Already Have an Account?{' '}
              <Link href={`/realtor-login`} className={`font-semibold text-dark-blue dark:text-white hover:underline`}>
                Log In{' '}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}