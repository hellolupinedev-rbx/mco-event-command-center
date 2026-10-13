import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'MCO Event Command Center',description:'Your private workspace for remarkable events. From first idea to lasting impact.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
