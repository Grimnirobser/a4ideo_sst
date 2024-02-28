"use client";

import { Channel, Problemset as ProblemsetType } from "@prisma/client";
// import ProblemsetInput from "./ProblemsetInput";
// import Problemset from "./Problemset";
import RightSideInput from "../RightSideInput";
import { useEffect, useState } from 'react'
import ProblemPagination from "./ProblemPagination";


interface ProblemsetSectionProps {
  problemsets: (ProblemsetType & { channel: Channel })[];
  videoId: string;
}

const ProblemsetSection: React.FC<ProblemsetSectionProps> = ({
  problemsets,
  videoId,
}) => {

  const [problemNum, setProblemNum] = useState(1);


  // const totalProblemset = problemsets? problemsets.length : 10;
  const totalProblemset = problemsets.length;

  let incrementProblemNum = () => setProblemNum(problemNum + 1);
  let decrementProblemNum = () => setProblemNum(problemNum - 1);

  if(problemNum <= 1) {
    decrementProblemNum = () => setProblemNum(1);
  }

  if (problemNum >= totalProblemset) {
    incrementProblemNum = () => setProblemNum(totalProblemset);
  }

  return (
    <>
    <ProblemPagination 
      end = {totalProblemset}
      current = {problemNum}
      increment = {incrementProblemNum}
      decrement = {decrementProblemNum}
    />

    <RightSideInput />

    <div className="peer w-full mt-4 px-4 pt-2 pb-2  rounded-md outline-none border-[1px] bg-slate-100 transition">
      <div className="">
      If you can make a better problemset for this video, you can click the button below your avatar to create a new one.
      </div>
    </div>
    </>
  )
};

export default ProblemsetSection;
