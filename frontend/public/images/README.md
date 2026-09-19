# Site photography and artwork

Drop image files here using the exact filenames below and they appear on the
site automatically. Any file that is missing falls back to a drawn scene or
emblem of the same size, so the layout never breaks.

Photo slots are rendered by `components/Photo.tsx`; the campaign logos by
`components/home/CampaignStrip.tsx`; the children by `components/Mascot.tsx`.
Formats: `.jpg`, `.png` or `.webp` (`.png` for anything that needs a
transparent background). Keep each file under ~400 KB.

## Home page

| Filename                              | Used for                                   | Recommended size / notes           |
| ------------------------------------- | ------------------------------------------ | ---------------------------------- |
| `banner.jpg`                          | Hero banner (the full painted illustration, wordmark included) | 2100 x 900, 21:9 |
| `banner-1.jpg` ... `banner-8.jpg`     | More banners; two or more turn the banner into a slideshow with dots | 2100 x 900, 21:9 |
| `campaign-rainbow.png`                | Rainbow logo oval                          | ~700 x 300, transparent            |
| `campaign-little_scholar.png`         | Little Scholar logo oval                   | ~700 x 300, transparent            |
| `campaign-balolsavam.png`             | Balolsavam logo oval                       | ~700 x 300, transparent            |
| `mascot-boy.png`                      | The boy beside the campaign shelf and on the invitation band | ~500 x 750, transparent cut-out |
| `mascot-girl.png`                     | The girl beside the campaign shelf and on the invitation band | ~500 x 750, transparent cut-out |
| `join-boy.png` / `join-girl.png`      | Invitation band ends (`JoinBand.tsx` references them directly) | transparent cut-out |
| `focus-1.png` ... `focus-6.png`       | Objectives-grid illustrations (`FocusGrid.tsx` references them directly) | transparent cut-out |
| `intro.jpg`                           | Introduction photograph                    | 1000 x 750                         |
| `news-1.jpg`, `news-2.jpg`            | News cards (used when a story has no cover image) | 800 x 500                  |
| `poster-1.jpg` ... `poster-8.jpg`     | Poster shelf (used when a poster has no cover image) | 600 x 800                 |
| `gallery-1.jpg` ... `gallery-8.jpg`   | Picture wall (used when an album has no cover) | 800 x 600                     |
| `video-feature.jpg`                   | Featured video thumbnail                   | 800 x 600                          |
| `video-1.jpg` ... `video-3.jpg`       | Up-next video thumbnails                   | 400 x 300                          |

Documents that carry their own `coverImage` URL in the database use that
picture instead of the local slot.

## Other pages

| Filename                              | Used on            | Recommended size |
| ------------------------------------- | ------------------ | ---------------- |
| `about.jpg`                           | About hero         | 1000 x 700       |
| `leader-1.jpg` ... `leader-4.jpg`     | Leaders cards      | 500 x 500        |
| `event-1.jpg` ... `event-5.jpg`       | Events list        | 600 x 450        |
