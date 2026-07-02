import VideoEmbed from '../shared/VideoEmbed'

interface ArticleVideoProps {
  videoUrl: string
  title: string
  className?: string
}

export default function ArticleVideo({ videoUrl, title, className = '' }: ArticleVideoProps) {
  return (
    <VideoEmbed
      videoUrl={videoUrl}
      title={title}
      className={className}
      showUnavailable
    />
  )
}
