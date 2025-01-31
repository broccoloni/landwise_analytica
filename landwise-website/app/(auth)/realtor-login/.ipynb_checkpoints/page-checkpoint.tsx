import Link from 'next/link';
import Form from './form';
import { raleway, roboto } from '@/ui/fonts';
import Container from '@/components/Container';

export default async function Login() {    
  return (
    <Container className="bg-white dark:bg-dark-gray-c no-scrollbar mx-auto rounded-xl px-5 py-5 bg-primary text-dark-brown">
      <div className="flex flex-col gap-y-[16px] text-black">
        <div className={`mb-1 text-4xl text-dark-blue dark:text-medium-green`}>Realtor Log In</div>
        <Form />
      </div>
      <div className={`${roboto.className} mt-6 text-black dark:text-white`}>
        New User?{' '}
        <Link href={`/realtor-signup`} className={`font-semibold text-dark-blue dark:text-white hover:underline`}>
          Become a Realtor Member{' '}
        </Link>
      </div>
    </Container>
  );
}