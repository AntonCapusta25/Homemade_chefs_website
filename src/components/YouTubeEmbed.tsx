interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
}

export default function YouTubeEmbed({ videoId, title = 'YouTube video' }: YouTubeEmbedProps) {
    if (!videoId) return null;

    return (
        <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-black">
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
}
