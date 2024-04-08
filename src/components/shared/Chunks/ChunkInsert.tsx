'use client';

import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";

export const ChunkInsert = ({ content }: { content: string }) => {
  let sx = {
    whiteSpace: "pre-wrap",
    backgroundColor: green[100],
    borderBottom: `2px solid ${green[400]}`,
  };
  return (
    <Box component="span" sx={sx}>
      {content}
    </Box>
  );
};