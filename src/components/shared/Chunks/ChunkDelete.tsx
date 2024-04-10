'use client';

import Box from "@mui/material/Box";
import { red } from "@mui/material/colors";



export const ChunkDelete = ({ content }: { content: string }) => {

  return (
    <Box
      component="span"
      sx={{
        backgroundColor: red[100],
        whiteSpace: "pre-wrap",
        "&::before": {
          content: `"${CSS.escape(content)}"`,
          textDecoration: "line-through",
          borderBottom: `2px solid ${red[400]}`,
        },
      }}
    ></Box>
  );
};