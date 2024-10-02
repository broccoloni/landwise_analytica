import Nav from '@/components/Nav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <div className="flex grow flex-row text-white transition-colors">
      <div
        className='h-full w-auto grow bg-accent-light bg-[size:224px]'
      >
        <div
          className='origin-left overflow-hidden transition duration-500 ease-in-out md:h-screen h-full min-h-screen w-full flex-col sm:flex-row bg-accent-light'
        >
          <Nav />
          <div className="flex h-full grow justify-center overflow-scroll overscroll-contain p-3 sm:ml-52 sm:mt-0 sm:mt-0 sm:p-8 lg:ml-64 text-black">
            <div className="mx-auto flex grow flex-col gap-y-4 after:pb-8 md:gap-y-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





