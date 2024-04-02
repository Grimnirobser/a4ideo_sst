'use client'

interface DocViewProps {
    documentSrc: string
}


export const DocView = ({documentSrc}: DocViewProps) => {

    return (

        <div className="relative w-full flex justify-center m-auto group bg-white aspect-w-2 aspect-h-3 overflow-y-auto no-scrollbar max-h-screen">
            {/* <Image
                unoptimized
                alt="Avatar"
                className="w-full z-[5] rounded-xl"
                src={imageSrc}
                height={150}
                width={100}
            /> */}
            <embed
                className="w-full h-full rounded-xl z-[5]"
                style={{
                        width: '100%',
                        height: '100%',
                }}
                type='application/pdf'
                src={documentSrc}
            />   
        </div>
    );


}