import Link from 'next/link'
import Image from 'next/image';
import { buttonVariants} from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default async function NotFoundPage() {

  return (

      <div className='flex bg-white w-full h-full flex-col items-center text-center justify-center sm:w-[350px]'>  
        <Image
            unoptimized
            fill
            sizes="100%"
            className='object-contain object-center rounded-lg w-full h-full'
            src="/rabbit-hole.jpeg"
            alt='rabbit hole'
        />

        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'absolute top-16 right-10 gap-1.5 text-lg decoration-rose-500 decoration-double',
          })}
          href='/'>
          <p className='text-rose-500 italic '>A rabbit hole! Go back to home</p>
          <ArrowRight className='h-4 w-4' color='red'/>
        </Link>
      </div>

    )
}   
  

