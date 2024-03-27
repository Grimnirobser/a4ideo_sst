
import { compactNumberFormat } from "@/lib/numUtils"; 


interface PostProps {
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


export const Post: React.FC<PostProps> = ({
    id,
    title,
    content,
    createdAt,
    viewCount,
    username,
    totalComment,
    likeCount,
    dislikeCount
}) =>{

    return (
        <div className="bg-white max-w-8/9 mx-20 mt-2 rounded-sm cursor-pointer">

            <h1 className="mx-4 mt-4 text-xl text-gray-700 font-bold">{title}</h1>
            <p className="mt-4 mx-4 text-gray-700 text-left font-serif text-lg">
                {content}
            </p>

            <div className="mt-4 mx-4 text-gray-700 text-left font-serif text-sm mb-2">
                <p>Created by {username} at {createdAt} Viewed {compactNumberFormat(viewCount)} times {compactNumberFormat(likeCount)} likes {compactNumberFormat(dislikeCount)} dislikes</p>
            </div>
        </div>
    )
}