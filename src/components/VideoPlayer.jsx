import React, { useRef } from 'react'

function isYouTube(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'))
}

function toEmbedUrl(url) {
  if (!url) return null
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([^?&]+)/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  // youtube.com/watch?v=ID
  const watch = url.match(/[?&]v=([^?&]+)/)
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`
  return url
}

export default function VideoPlayer({ url, title }) {
  const videoRef = useRef(null)

  if (!url) {
    return (
      <div className="aspect-video bg-hopair-dark rounded-xl flex items-center justify-center text-slate-500 border border-slate-700">
        No video available
      </div>
    )
  }

  if (isYouTube(url)) {
    const embedUrl = toEmbedUrl(url)
    return (
      <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
        <iframe
          className="w-full h-full"
          src={`${embedUrl}?rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  // Direct file (local / S3)
  return (
    <div className="aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        src={url}
        title={title}
      >
        Your browser does not support video playback.
      </video>
    </div>
  )
}
