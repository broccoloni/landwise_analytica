import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Form from './form';
import { raleway, roboto } from '@/ui/fonts';
import Container from '@/components/Container';

export default async function Login() {
  const session = await getServerSession();
    
  if (session?.user?.email) {
    redirect('/dashboard/');
  }
    
  return (
    <>
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
    </>
  );
}