"use client";

import { User, ProblemSet as ProblemsetType } from "@prisma/client";
import ProblemsetInput from "./ProblemsetInput";
import Problemset from "./Problemset";



interface ProblemsetSectionProps {
  problemsets: (ProblemsetType & { user: User })[];
  videoId: string;
}

const ProblemsetSection: React.FC<ProblemsetSectionProps> = ({
  problemsets,
  videoId,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full mb-4">
      <p>{problemsets.length} Problemsets</p>
      <ProblemsetInput videoId={videoId} />
      <div className="flex flex-col gap-4 mt-4">
        {problemsets.map((problemset) => {
          return <Problemset key={problemset.id} problemset={problemset} />;
        })}
      </div>
    </div>
  );
};

export default ProblemsetSection;
