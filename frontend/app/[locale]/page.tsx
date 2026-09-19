import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { api } from "@/lib/api";
import { demoAlbums, demoNews, demoPosters, demoVideos, withDemo } from "@/lib/demo";
import { pageMeta } from "@/lib/seo";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CampaignStrip } from "@/components/home/CampaignStrip";
import { AboutIntro } from "@/components/home/AboutIntro";
import { StatsBar } from "@/components/home/StatsBar";
import { NewsPosters, type NewsDoc, type PosterDoc } from "@/components/home/NewsPosters";
import { PhotosVideos, type AlbumDoc, type VideoDoc } from "@/components/home/PhotosVideos";
import { FocusGrid } from "@/components/home/FocusGrid";
import { JoinBand } from "@/components/home/JoinBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale === "ml" ? "ml" : "en");
  return pageMeta(locale, "/", dict.hero.title, dict.hero.subtitle);
}

/**
 * Home, following the reference sheet top to bottom: the illustrated banner,
 * the campaign shelf, the introduction beside its photograph, the reach bar,
 * stories next to posters, pictures next to videos, the six things we do, and
 * the invitation to join sitting on the footer's hills.
 *
 * Every band draws from a real collection where one exists - news, gallery,
 * publications - and falls back to the clearly-labelled demo documents so the
 * layout is reviewable before the database is filled.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const home = dict.home;

  /* One round trip per band, in parallel. Posters and videos are the two
     `kind`s of the publications collection the home page shows. */
  const [n, g, p, v] = await Promise.all([
    api.news("?limit=2"),
    api.gallery("?limit=8"),
    api.publications("?limit=8&kind=notice"),
    api.publications("?limit=4&kind=video"),
  ]);

  const news = withDemo<NewsDoc>(n?.data as NewsDoc[], demoNews);
  const albums = withDemo<AlbumDoc>(g?.data as AlbumDoc[], demoAlbums);
  const posters = withDemo<PosterDoc>(p?.data as PosterDoc[], demoPosters);
  const videos = withDemo<VideoDoc>(v?.data as VideoDoc[], demoVideos);

  return (
    <main className="bg-white">
      {/* The banner and the campaign shelf share the pale sky the page opens on. */}
      <div className="bg-gradient-to-b from-sky-soft/80 via-white to-white">
        <HeroBanner tagline={home.banner.tagline} alt={home.banner.alt} slideLabel={home.banner.slide} />
        <CampaignStrip locale={locale} title={home.campaigns.title} sub={home.campaigns.sub} items={home.campaigns.items} prevLabel={home.campaigns.prev} nextLabel={home.campaigns.next} />
      </div>

      <AboutIntro
        locale={locale}
        badge={home.intro.badge}
        line1={home.intro.line1}
        line2={home.intro.line2}
        body={home.intro.body}
        cta={home.intro.cta}
      />

      <StatsBar items={home.stats.items} />

      <NewsPosters
        locale={locale}
        news={news}
        posters={posters}
        newsTitle={home.news.title}
        postersTitle={home.posters.title}
        viewAll={dict.common.viewAll}
        readMore={dict.common.readMore}
        demoLabel={dict.common.demo}
        prevLabel={home.campaigns.prev}
        nextLabel={home.campaigns.next}
      />

      <PhotosVideos
        locale={locale}
        albums={albums}
        videos={videos}
        photosTitle={home.photos.title}
        photosSub={home.photos.sub}
        photosFootnote={home.photos.footnote}
        videosTitle={home.videos.title}
        videosSub={home.videos.sub}
        videosFootnote={home.videos.footnote}
        playLabel={home.videos.play}
        viewAll={dict.common.viewAll}
      />

      <FocusGrid locale={locale} title={home.focus.title} sub={home.focus.sub} items={home.focus.items} />

      <JoinBand locale={locale} title={home.join.title} sub={home.join.sub} cta={home.join.cta} />
    </main>
  );
}
