import { Metadata } from 'next'


export function constructMetadata({
    title = 'A4ideo - Never frame your answer.',
    description = 'A4ideo - the gathering of next generation fragment learning.',
    image = '/a4ideo_title.png',
    icons = '/a4ideo_logo.ico',
    noIndex = false,
  }: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
  } = {}): Metadata {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
        creator: '@a4ideo',
      },
      icons,
      metadataBase: new URL('https://a4ideo.com/'),
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        },
      }),
    }
  }
