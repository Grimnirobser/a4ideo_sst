'use client';
import Image from "next/image";
import dayjs from "@/vendor/dayjs";
import { SimpleLikeDislikeButton } from "@/components/shared/SimpleLikeDislikeButton"; 
import { compactNumberFormat } from "@/lib/numUtils";
import { Post } from "@/components/shared/Post"; 
import { useRouter } from 'next/navigation'
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface subType {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    viewCount: number;
    totalVotes: number;
    totalLike: number;
}

interface postType {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    viewCount: number;
    username: string;
    totalComment: number;
    likeCount: number;
    dislikeCount: number;
}

interface followType {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    viewCount: number;
}


export default function SubPage(){
    // const sub : subType = {
    //     id: "1",
    //     title: "/three-body-problem",
    //     description: "The Three-Body Problem (Chinese: 三体; lit. 'Three-Body') is a story by Chinese science fiction author Liu Cixin, the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present and future wherein Earth encounters an alien civilization from a nearby system of three sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics. The story was originally serialized in Science Fiction World in 2006 before it was published as a standalone book in 2008. In 2006, it received the Galaxy Award (Yínhé Jiǎng) for Chinese science fiction. In 2012, it was described as one of the genre's most successful novels of the previous two decades. The English translation by Ken Liu was published by Tor Books in 2014. That translation was the first novel by an Asian writer to win a Hugo Award for Best Novel; it was also nominated for the Nebula Award for Best Novel. The book has been adapted into other media. In 2015, a Chinese film adaptation of the same name was in production, but it was never released. A Chinese TV series, Three-Body, released in early 2023 to critical success locally. An English language Netflix series, 3 Body Problem, was released in March 2024.",
    //     createdAt: "2022-01-01",
    //     viewCount: 1000,
    //     totalVotes: 2342352,
    //     totalLike: 2000000,
    // }

    // const post1: postType = {
    //     id: "1",
    //     title: "Welcome to the universe of Three Body Problem",
    //     content: "Alice's Adventures in Wonderland (commonly Alice in Wonderland) is an 1865 English children's novel by Lewis Carroll, a mathematics don at Oxford University. It details the story of a young",
    //     createdAt: "2022-01-01",    
    //     viewCount: 1000,
    //     username: "Alice",
    //     totalComment: 100,
    //     likeCount: 100,
    //     dislikeCount: 10
    // }

    // const post2: postType = {
    //     id: "2",
    //     title: "The Three-Body Problem: A Cosmic Mystery",
    //     content: "The three-body problem is a fascinating and complex concept in celestial mechanics that has captivated scientists and mathematicians for centuries. It refers to the challenge of accurately predicting the motion of three celestial bodies interacting with each other through gravitational forces. Unlike the two-body problem, which has a relatively simple and predictable solution, the three-body problem introduces a level of chaos and unpredictability that makes it incredibly difficult to solve.",
    //     createdAt: "2022-01-01",    
    //     viewCount: 19,
    //     username: "Alice",
    //     totalComment: 100,
    //     likeCount: 10,
    //     dislikeCount: 10
    // }
    // const post3: postType = {
    //     id: "3",
    //     title: "Why People would abandon Luo Ji and elect Cheng Xin as the Swordholder????",
    //     content: "I think the issue here is not with Cheng Xin but the human civilization itself for giving her so much power and trusting her to do the right thing. It just shows how weak and emotional humanity as a whole is and that the only way to advance is to lose some of that, which the galactic humans/Zhang proved.",
    //     createdAt: "2022-01-01",    
    //     viewCount: 1000,
    //     username: "Alice",
    //     totalComment: 100,
    //     likeCount: 100,
    //     dislikeCount: 10
    // }
    // const post4: postType = {
    //     id: "4",
    //     title: "Feeling bad about the aliens",
    //     content: "okay as a first time reader, i am almost 70% done with the first book and I can't believe this book made me really feel sad about the Trisolarians.. the writing is so good it made me shed a tear for an fictional alien race. But jokes aside, it hurt me reading about the harsh struggles the Trisolarians dealt with because of the three body problem. How utterly nightmarish their world was.. how doomed they were as a species. I was literally cheering up for these aliens when they discovered and were capable of Interstellar space travel. Right now I am rooting more for the Trisolarians than I am for the humans. Sorry humanity I am in the same boat as Ye Wenjie but for different reasons.",
    //     createdAt: "2023-02-01",    
    //     viewCount: 100,
    //     username: "HonoredOne77",
    //     totalComment: 100,
    //     likeCount: 100,
    //     dislikeCount: 10
    // }
    // const post5: postType = {
    //     id: "5",
    //     title: "This animation of the Three-Body Problem",
    //     content: "The three-body problem has also captured the imagination of science fiction writers, serving as a source of inspiration for numerous novels, short stories, and films. The concept has been explored in works such as Cixin Liu's The Three-Body Problem trilogy, which delves into the consequences of an alien civilization grappling with the challenges posed by a chaotic three-star system.",
    //     createdAt: "2023-06-01",    
    //     viewCount: 2300,
    //     username: "RuboPosto",
    //     totalComment: 100,
    //     likeCount: 100,
    //     dislikeCount: 10
    // }

    // const post6: postType = {
    //     id: "6",
    //     title: "The Books",
    //     content: "I absolutely love the show and want to find out what happens next. My question is should I read the first book or do you think I’d be okay starting out with the dark forest since I’ve already finished the 1st season?",
    //     createdAt: "2022-01-01",    
    //     viewCount: 1000,
    //     username: "CryptographerOne1509",
    //     totalComment: 100,
    //     likeCount: 100,
    //     dislikeCount: 10
    // }

    // const post7: postType = {
    //     id: "7",
    //     title: "Will I be able to continue in the books from where the show ends?",
    //     content: "I really liked the show, and it made me interested in the books. But from what I can see from reading some of the posts in the subreddit, the book version seems to be quite different in some areas. Will I be able to continue reading from where the first season of the show ends and if so, are there any differences I should be aware of so I'm not completely lost?",
    //     createdAt: "2022-01-01",    
    //     viewCount: 1000,
    //     username: "Luo Ji",
    //     totalComment: 100,
    //     likeCount: 29,
    //     dislikeCount: 10
    // }


    // const posts = [];
    // posts.push(post1);
    // posts.push(post2);
    // posts.push(post3);
    // posts.push(post4);
    // posts.push(post5);
    // posts.push(post6);
    // posts.push(post7);

    const router = useRouter();
    const { toast } = useToast();
    useEffect(() => {
        router.push("/");
        toast({
            variant: "error",
            title: "Community is under development.",
          });
        }, [router, toast]); 
    

    return (
        <div>
            Community is under development.
        </div>
        // <div className="bg-slate-100 h-full space-y-4">
        //     <div className="grid grid-cols-5 grid-flow-row gap-2 mx-20">
        //         <div className="col-span-1 aspect-w-2 aspect-h-3">
        //             <Image
        //                 unoptimized
        //                 className="object-cover rounded-lg"
        //                 src="../threeBody.jpg"
        //                 alt={`Thumbnail for ${sub.title}`}
        //                 sizes="100%"
        //                 fill
        //             />
        //         </div>

        //             <div className="col-span-4 space-y-6">
        //                 <h3 className="top-6 line-clamp-2 text-xl font-medium italic">
        //                     {sub.title}
        //                 </h3>

        //                 <div className="whitespace-pre-line text-sm text-neutral-400">
        //                         {sub.description.split("\n").map((line, index) => {
        //                         return line === "" ? (
        //                             <br key={index} />
        //                         ) : (
        //                             <p key={index}>{line}</p>
        //                         );
        //                         })}
        //                 </div>

        //                 <p className="text-neutral-400 text-sm">
        //                     Community created {dayjs(sub.createdAt).fromNow()}
        //                 </p>
                        
        //                 <div className="text-neutral-400 text-sm">
        //                     <p>Vote for the media, we will rank the media based on votes</p>
        //                     <p>Total Votes collected {compactNumberFormat(sub.totalVotes)}</p>
        //                 </div>

        //                 <SimpleLikeDislikeButton totalLike={sub.totalLike} totalDislike={sub.totalVotes-sub.totalLike}/>

        //         </div>
        //     </div>

        //     <div className="flex flex-col items-center gap-4">
        //         { posts.map((post, index) => 
        //             <Post key={index} {...post}/>
        //         )}
        //     </div>

        // </div>
    )
}