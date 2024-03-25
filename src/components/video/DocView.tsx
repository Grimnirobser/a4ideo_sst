'use client'

import Image from "next/image";


interface DocViewProps {
    imageSrc: string
}


export const DocView = ({imageSrc}: DocViewProps) => {

    return (

        <div className="relative w-full flex justify-center m-auto group bg-white aspect-w-10 aspect-h-15">
            <Image
                unoptimized
                alt="Avatar"
                className="w-full z-[5] rounded-xl"
                src={imageSrc}
                height={150}
                width={100}
            />
        </div>
    );


}