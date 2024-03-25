
import Image from "next/image";


const AboutPage = () => {


    return (
        <div className="flex flex-col items-center h-screen bg-slate-100 mx-60">
            <h1 className="text-4xl text-gray-700 font-bold mt-4">About A4ideo</h1>

            <p className="text-gray-700 mt-4 text-left font-serif mx-4 text-lg">
                Hello Everyone, I am Eron, the creator of A4ideo.
            </p>
            <Image
                unoptimized
                alt="Avatar"
                className="rounded-sm object-contain mt-4"
                height={128}
                width={128}
                src={"./eronying.jpg"}
                />
            <p className="text-gray-700 mt-4 text-left font-serif mx-4 text-lg indent-6">
            I am a big fan of detective series. A few months ago, 
            I was watching one on a website that showed all the evidences, relationships, 
            and potential motivations, but not the criminal or how the crime was committed. 
            At that time, a multiple-choice question popped up asking who I thought the criminal was, 
            and numerous danmaku subtitles were discussing this. 
            I thought I could train a language model (LLM) to accept those perspectives and provide feedback on whether it could correctly identify the criminal. 
            Later I realized it would be better to apply this approach to books we read, like or videos we watched, 
            like what happened to the old man in <cite>The Old Man and the Sea</cite>? 
            or how do you put an elephant into a fridge? I collected data and trained a LLM. 
            Though the LLM is not trained for answering the questions, 
            it is trained to distinguish if the perspective is sufficient and simple enough to cover the answer. 
            So if you want to present a question, you may submit the yours solution as well.
            </p>

            <p className="text-gray-700 mt-4 text-left font-serif mx-4 text-lg indent-6">
            Please feel free to reach out to me at eronying@a4ideo.com or join the A4ideo Discord server. 
            I am always looking for feedback and suggestions to improve the platform. 
            I hope you enjoy using A4ideo as much as I enjoyed building it.
            </p>

        </div>
        );


}

export default AboutPage;