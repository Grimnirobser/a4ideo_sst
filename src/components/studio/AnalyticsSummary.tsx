"use client";

import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Video, Problemset, Attempt } from "@prisma/client";
import { useContext, useMemo } from "react";
import Avatar, { AvatarSize } from "../shared/Avatar";
import AnalyticsSummaryItem from "./AnalyticsSummaryItem";
import { compactNumberFormat, safeRoundOneDecimalDivider } from "@/lib/numUtils";

interface AnalyticsSummaryProps {
  videos: Video[];
  problemsets: Problemset[];
  attempts: Attempt[];
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ videos, problemsets, attempts }) => {
  useProtectedRoute();

  const currentChannel = useContext(CurrentChannelContext);

  const ChannelCreatedProblemsetsIds = problemsets?.map((problemset) => problemset.channelId);

  const viewsCount = useMemo(
    () =>
      videos?.reduce((totalViews, video) => totalViews + video.viewCount, 0),
    [videos]
  );

  const AttemptCountProblemset = useMemo(
    () =>
      problemsets?.reduce((totalAttempt, problemset) => totalAttempt + problemset.attemptCount, 0),
    [problemsets]
  );

  const PassCountProblemset = useMemo(
    () =>
      problemsets?.reduce((totalPass, problemset) => totalPass + problemset.passCount, 0),
    [problemsets]
  );

  const totalProblemsetAttempted = useMemo(
    () =>
      attempts?.filter((attempt) => !ChannelCreatedProblemsetsIds.includes(attempt.problemsetId)).length,
    [attempts, ChannelCreatedProblemsetsIds]
  );

  const totalProblemsetPassed = useMemo(
    () =>
      attempts?.filter((attempt) => !ChannelCreatedProblemsetsIds.includes(attempt.problemsetId) && attempt.passedBefore===true).length,
    [attempts, ChannelCreatedProblemsetsIds]
  );
  


  return (
    <div className="mx-auto flex items-center gap-4">
      <Avatar
        size={AvatarSize.large}
        imageSrc={currentChannel?.imageSrc}
        className="hidden md:inline"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsSummaryItem
          value={currentChannel?.username}
          subtitle="Author"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(currentChannel?.subscriberCount)}
          subtitle="Subscribers"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(viewsCount)}
          subtitle="Views"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(videos.length)}
          subtitle="Videos"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(totalProblemsetAttempted)}
          subtitle="Attempted Problemsets"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(totalProblemsetPassed)}
          subtitle="Passed Problemsets"
        />
        <AnalyticsSummaryItem
          value={compactNumberFormat(AttemptCountProblemset)}
          subtitle="Owned Problemsets Attempts"
        />
        <AnalyticsSummaryItem
          value={safeRoundOneDecimalDivider(PassCountProblemset, AttemptCountProblemset) + "%"}
          subtitle="Owned Problemsets Pass Rate"
        />

        
      </div>
    </div>
  );
};

export default AnalyticsSummary;
