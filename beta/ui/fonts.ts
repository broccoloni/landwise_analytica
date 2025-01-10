import { Montserrat, Roboto, Merriweather, Nunito, Raleway } from 'next/font/google';
import localFont from 'next/font/local';

export const montserrat = Montserrat({ 
    subsets: ['latin'] 
});

export const roboto = Roboto({ 
    weight: ['300','400','700','900'],
    subsets: ['latin'] 
});

export const merriweather = Merriweather({ 
    weight: ['300','400','700','900'],
    subsets: ['latin'] 
});

export const nunito = Nunito({ 
    subsets: ['latin'] 
});

export const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const abhaya = localFont({
  src: [
    {
      path: '/fonts/AbhayaLibre-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});
