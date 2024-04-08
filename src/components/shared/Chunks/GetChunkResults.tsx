'use client';
import { ChunkDelete } from "./ChunkDelete";
import { ChunkEqual } from "./ChunkEqual";
import { ChunkInsert } from "./ChunkInsert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { RightWrongIcon } from "../RightWrongIcon";

interface GetChunkResultsProps {
    refined: [string, 'pass' | 'fail'| 'equal'][],
}

export const GetChunkResults = ({refined}:GetChunkResultsProps) => {
    const result: JSX.Element[] = [];

    refined.forEach((item, index) => {
        const [content, status] = item;
        switch (status) {
            case "pass":
                result.push(<ChunkInsert key={index} content={content} />);
                break;
            case "fail":
                result.push(<ChunkDelete key={index} content={content} />);
                break;
            case "equal":
                result.push(<ChunkEqual key={index} content={content} />);
                break;
            default:
                break;
        }
    });

    return (
        <div className="relative">
        <Stack spacing={2} direction="column" flexGrow={1} 
            className="flex w-full h-fit mb-2 rounded-md border-[1px] bg-slate-50 border-zinc-50 text-left items-start">
                
                <Box
                    sx={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    flexGrow: 1,
                    }}
                >
                {result}
                </Box>
        </Stack>
        </div>
    );
}