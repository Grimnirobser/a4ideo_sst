'use client'

import Image from "next/image";


interface DocViewProps {
    imageSrc: string
}


export const DocView = ({imageSrc}: DocViewProps) => {

    return (

        <div className="relative w-full flex justify-center m-auto group bg-white">
            <Image
                unoptimized
                alt="Avatar"
                className="w-full aspect-video z-[5] rounded-xl"
                src={imageSrc}
                height={90}
                width={160}
            />
        </div>
    );


}