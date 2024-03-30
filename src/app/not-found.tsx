import Link from 'next/link'
import Image from 'next/image';
import { buttonVariants} from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default async function NotFoundPage() {

  return (

      <div className='flex flex-col items-center text-center mx-auto justify-center space-y-6 sm:w-[350px] lg:px-0'>  
        <Image
            unoptimized
            fill
            sizes="100%"
            className='-z-10 object-contain object-center rounded-lg h-20 w-20'
            src="/rabbit-hole.jpeg"
            alt='rabbit hole'
        />

        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'absolute top-10 right-10 gap-1.5 text-lg',
          })}
          href='/'>
          A rabbit hole! Go back to home
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>


    )
}   
  

