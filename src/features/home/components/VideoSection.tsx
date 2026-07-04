import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Video {
  title: string;
  youtubeId: string;
  description: string;
}

const videos: Video[] = [
  {
    title: "Client Acquisition System",
    youtubeId: "9uEhwPiAWko",
    description: "Finds, Talks To, and Closes Clients (OpenAI + n8n + Vapi + ElevenLabs).\nAn AI-powered client acquisition system that helps freelancers and small agencies get clients on autopilot, no manual outreach, no chasing leads.",
  },
  {
    title: "Siri + n8n Personal Assistant",
    youtubeId: "TNvFyeE1ILY",
    description: "Siri feels limited. It can set alarms and reminders, but it doesn't actually act like a personal assistant.\nSo I decided to fix that. Instead of just \"listening,\" Siri now actually \"does things\".",
  },
];

const YouTubeThumbnail = ({ video }: { video: Video }) => {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className="relative aspect-video w-full group/play cursor-pointer"
      aria-label={`Play ${video.title}`}
    >
      <img
        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-background/30 group-hover/play:bg-background/10 transition-colors duration-200 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform duration-200">
          <Play size={22} className="text-primary-foreground ml-0.5" fill="currentColor" />
        </div>
      </div>
    </button>
  );
};

const VideoSection = () => {
  return (
    <section id="videos" className="section-spacing border-t border-border">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              className="section-label mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              Talks & Walkthroughs
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-foreground"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              Video Highlights
            </motion.h2>
          </div>
          <motion.a
            href="https://www.youtube.com/@devayushrout"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150 inline-flex items-center gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            view channel
            <ArrowUpRight size={10} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.youtubeId}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-muted-foreground/30 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
            >
              <YouTubeThumbnail video={video} />
              <div className="p-5">
                <h3 className="text-[15px] font-medium text-foreground mb-1.5 leading-snug">
                  {video.title}
                </h3>
                <p className="text-[13px] text-muted-foreground leading-[1.65]">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
