import getTrendingVideos from "@/actions/getTrendingVideos";
import VideoCard from "@/components/shared/VideoCard";
import crypto from "crypto";
import { Bucket } from "sst/node/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function getServerSideProps() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.public.bucketName,
  });
  const url = await getSignedUrl(new S3Client({}), command);

  return { props: { url } };
}



export default async function Home() {
  const trendingVideos = await getTrendingVideos();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trendingVideos
        ? trendingVideos.map((trendingVideo) => {
            return (
              <VideoCard
                key={trendingVideo.id}
                video={trendingVideo}
                channel={trendingVideo.channel}
                channelAvatar
              />
            );
          })
        : "No videos found"}
    </div>
  );
}
