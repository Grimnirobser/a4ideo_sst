import VideoCard from "@/components/shared/VideoCard";
import getUnapprovedVideos from "@/actions/getUnapprovedVideos";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default async function AuditPage() {
    const unapprovedVideos = await getUnapprovedVideos();

    return (
        <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {unapprovedVideos
            ? unapprovedVideos.map((unapprovedVideo) => {
                return (
                <VideoCard
                    key={unapprovedVideo.id}
                    video={unapprovedVideo}
                    channel={unapprovedVideo.channel}
                    channelAvatar
                />
                );
            })
            : "No videos found"}
        </div>
    );
}
