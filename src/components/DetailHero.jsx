import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, Clock3, Headphones, PhoneCall, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "./Button";

const metricIcons = { calls: PhoneCall, coverage: Clock3, response: CalendarClock, quality: CheckCircle2, support: Headphones, growth: BarChart3, security: ShieldCheck };

function imageCandidates(type, title) {
  const folder = type === "industry" ? "industries" : "services";
  const encodedTitle = encodeURIComponent(title);
  const slug = String(title).toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
  return [...new Set([
    `/${folder}/${encodedTitle}.webp`,
    `/${folder}/${slug}.webp`,
    `/${folder}/${slug}.png`,
    `/${folder}/default.webp`,
  ])];
}

export function DetailHero({ type, item, description }) {
  const images = useMemo(() => imageCandidates(type, item.name), [item.name, type]);
  const imageKey = `${type}:${item.name}`;
  const [imageState, setImageState] = useState({ key: imageKey, index: 0 });
  const imageIndex = imageState.key === imageKey ? imageState.index : 0;
  const metrics = item.metrics || [];
  const typeLabel = type === "industry" ? "Industry" : "Service";

  const handleImageError = () => setImageState({ key: imageKey, index: Math.min(imageIndex + 1, images.length - 1) });

  const heroVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: "easeOut", staggerChildren: 0.09 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } } };

  return <motion.section className="detail-hero" variants={heroVariants} initial="hidden" animate="visible">
    <div className="detail-hero-main">
      <div className="detail-hero-copy">
        <motion.span className="detail-hero-icon" variants={itemVariants}><span>{type === "industry" ? <BarChart3 size={22} /> : <Headphones size={22} />}</span>{typeLabel}</motion.span>
        <motion.p className="detail-hero-kicker" variants={itemVariants}>ZMH USA CORP. OPERATIONS</motion.p>
        <motion.h1 variants={itemVariants}>{item.name}</motion.h1>
        <motion.p variants={itemVariants}>{description}</motion.p>
        <motion.div className="detail-hero-actions" variants={itemVariants}><Button to={type === "industry" ? "/industries" : "/services"}>View {typeLabel}</Button><Button to="/book-service" variant="secondary">Book Consultation</Button></motion.div>
      </div>
      <motion.div className="detail-hero-image-wrap" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <img src={images[imageIndex]} alt={`${item.name} operations`} loading="lazy" onError={handleImageError} />
        <span className="detail-hero-image-overlay" />
        <span className="detail-hero-image-label">Built for better operations <ArrowRight size={16} /></span>
      </motion.div>
    </div>
    <motion.div className="detail-hero-metrics" initial="hidden" animate="visible" variants={{ visible: { transition: { delayChildren: 0.3, staggerChildren: 0.08 } } }}>
      {metrics.map((metric) => {
        const Icon = metricIcons[metric.icon] || BarChart3;
        return <motion.article key={metric.label} variants={itemVariants} whileHover={{ y: -3 }}><span><Icon size={19} /></span><div><strong>{metric.value}</strong><small>{metric.label}</small></div></motion.article>;
      })}
    </motion.div>
  </motion.section>;
}
