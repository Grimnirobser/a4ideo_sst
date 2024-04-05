"use client";

interface FirstPageBannerProps {
    bgColor: string;
}

const FirstPageBanner: React.FC<FirstPageBannerProps> = ({ bgColor }) => {


  return (

        <div className="group mx-10 my-10 sm:mx-20 bg-white hover:bg-slate-50 border rounded-md" onClick={() => window.open("https://crowdmark.com/multiple-choice-vs/integrating-writing-and-multiple-choice/assessments/", '_blank')}>
            <div className="flex items-start flex-col cursor-pointer overflow-hidden px-10 py-10 w-full h-fit">
                
                <div className="flex flex-row justify-between gap-2 items-center w-full h-full">


                    <div className="relative w-full h-full">

                        <p className="w-full h-full items-center indent-8 font-serif text-2xl italic">
                        &quot;Ostensibly, these types of questions<span className="w-full h-full bg-rose-200">(free-response questions)</span> offer a different challenge, 
                            as they do not offer any options of answers; rather, they <span className="w-full h-full bg-green-200">offer a prompt that inspires critical thinking.</span> 
                            This is what leads to the perception that written responses <span className="w-full h-full bg-sky-200">are more effective in supporting higher level thinking</span>&quot;
                        </p>
                    </div>
                    
                </div>


                            <div className="flex flex-row w-full justify-end place-items-end mt-8">
                                <div className="flex place-items-end justify-end gap-2">
                                
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <p className="line-clamp-2 text-md leading-5">
                                        By Crowdmark Team
                                        </p>
                                    </div>
                                    <p className="text-neutral-400 text-sm">
                                    February 28, 2022
                                    </p>
                                </div>
                            </div>
                            </div>
                </div>
        </div>
  );
};

export default FirstPageBanner;
