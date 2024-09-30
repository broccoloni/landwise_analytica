import { Montserrat, Roboto, Merriweather } from 'next/font/google';
 
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