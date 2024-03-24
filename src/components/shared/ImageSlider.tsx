"use client"

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import type SwiperType from 'swiper'
import { useEffect, useState } from 'react'
import { Pagination } from 'swiper/modules'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SlideItemProps {
    isImage: boolean,
    source: string,
}

interface ImageSliderProps {
    slides: SlideItemProps[], 
    activeIndex: number,
    setActiveIndex: (index: number) => void,
}

const ImageSlider = ( {slides, activeIndex, setActiveIndex} : ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(
    null
  )

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (slides.length ?? 0) - 1,
  })

  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      setActiveIndex(activeIndex)
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (slides.length ?? 0) - 1,
      })
    })
  }, [swiper, slides.length, setActiveIndex])

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300'
  const inactiveStyles = 'hidden text-gray-400'

  return (
    <div className='group bg-zinc-100 aspect-square overflow-hidden rounded-xl'>
      <div className='absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition'>
        <button
          onClick={(e) => {
            e.preventDefault()
            swiper?.slideNext()
          }}
          className={cn(
            activeStyles,
            'right-3 transition',
            {
              [inactiveStyles]: slideConfig.isEnd,
              'hover:bg-primary-300 text-primary-800 opacity-100':
                !slideConfig.isEnd,
            }
          )}
          aria-label='next image'>
          <ChevronRight className='h-4 w-4 text-zinc-700' />{' '}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            swiper?.slidePrev()
          }}
          className={cn(activeStyles, 'left-3 transition', {
            [inactiveStyles]: slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100':
              !slideConfig.isBeginning,
          })}
          aria-label='previous image'>
          <ChevronLeft className='h-4 w-4 text-zinc-700' />{' '}
        </button>
      </div>

      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className='h-full w-full'>
        {slides.map((slideItem, i) => (
          <SwiperSlide
            key={i}
            className='-z-10 relative h-full w-full'>
                {slideItem.isImage ? 
                <Image
                    unoptimized
                    fill
                    sizes="100%"
                    className='-z-10 object-cover object-center rounded-lg'
                    src={slideItem.source}
                    alt='poster image'
                /> : <div className='-z-10 object-cover object-center mx-2 my-2 text-muted-foreground text-lg'>
                        {slideItem.source}
                    </div>}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ImageSlider