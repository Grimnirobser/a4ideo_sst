"use client";

import Link from "next/link";   
import { Icons } from './Icons';

const Logo = () => {
  return (
    <Link href="/">
      <Icons.title className='h-9 w-auto ml-1' />
    </Link>
  );
};

export default Logo;