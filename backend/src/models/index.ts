import mongoose, { Schema } from "mongoose";

const localized = (required: boolean) => ({
  en: { type: String, required, trim: true, maxlength: 5000 },
  ml: { type: String, default: "", trim: true, maxlength: 5000 },
});

const baseContentFields = {
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: localized(true), required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  coverImage: { type: String, default: "", maxlength: 500 },
};

export const Program =
  mongoose.models.Program ??
  mongoose.model(
    "Program",
    new Schema(
      {
        ...baseContentFields,
        type: {
          type: String,
          enum: ["general", "little_scholar", "rainbow", "balolsavam", "other"],
          default: "general",
        },
        summary: { type: localized(true), required: true },
        body: { type: localized(true), required: true },
        ageGroup: { type: String, default: "", maxlength: 60 },
        gallery: { type: [String], default: [] },
        seoTitle: { type: String, default: "", maxlength: 160 },
        seoDescription: { type: String, default: "", maxlength: 300 },
      },
      { timestamps: true }
    )
  );

export const Event =
  mongoose.models.Event ??
  mongoose.model(
    "Event",
    new Schema(
      {
        ...baseContentFields,
        description: { type: localized(true), required: true },
        venue: { type: localized(true), required: true },
        district: { type: String, default: "", maxlength: 80 },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        timeLabel: { type: String, default: "", maxlength: 80 },
        images: { type: [String], default: [] },
        programSlug: { type: String, default: "", maxlength: 120 },
      },
      { timestamps: true }
    )
  );

export const News =
  mongoose.models.News ??
  mongoose.model(
    "News",
    new Schema(
      {
        ...baseContentFields,
        excerpt: { type: localized(true), required: true },
        body: { type: localized(true), required: true },
        tags: { type: [String], default: [] },
        publishedAt: { type: Date },
      },
      { timestamps: true }
    )
  );

export const Leader =
  mongoose.models.Leader ??
  mongoose.model(
    "Leader",
    new Schema(
      {
        name: { type: localized(true), required: true },
        role: { type: localized(true), required: true },
        group: { type: String, enum: ["state", "district", "advisor"], default: "state" },
        district: { type: String, default: "", maxlength: 80 },
        photo: { type: String, default: "", maxlength: 500 },
        bio: { type: localized(false), default: { en: "", ml: "" } },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
      { timestamps: true }
    )
  );

export const GalleryAlbum =
  mongoose.models.GalleryAlbum ??
  mongoose.model(
    "GalleryAlbum",
    new Schema(
      {
        slug: { type: String, required: true, unique: true, trim: true },
        title: { type: localized(true), required: true },
        description: { type: localized(false), default: { en: "", ml: "" } },
        coverImage: { type: String, default: "", maxlength: 500 },
        images: {
          type: [
            {
              key: { type: String, required: true },
              cdnUrl: { type: String, required: true },
              caption: { type: localized(false), default: { en: "", ml: "" } },
              width: Number,
              height: Number,
            },
          ],
          default: [],
        },
        eventSlug: { type: String, default: "", maxlength: 120 },
        takenAt: { type: Date },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
      },
      { timestamps: true }
    )
  );

export const Page =
  mongoose.models.Page ??
  mongoose.model(
    "Page",
    new Schema(
      {
        slug: { type: String, required: true, unique: true, trim: true },
        title: { type: localized(true), required: true },
        blocks: {
          type: [
            {
              type: {
                type: String,
                enum: ["hero", "text", "stats", "timeline", "faq", "cta", "media"],
              },
              heading: { type: localized(false), default: { en: "", ml: "" } },
              body: { type: localized(false), default: { en: "", ml: "" } },
              image: { type: String, default: "" },
            },
          ],
          default: [],
        },
        seoTitle: { type: String, default: "" },
        seoDescription: { type: String, default: "" },
        status: { type: String, enum: ["draft", "published"], default: "published" },
      },
      { timestamps: true }
    )
  );

export const Publication =
  mongoose.models.Publication ??
  mongoose.model(
    "Publication",
    new Schema(
      {
        slug: { type: String, required: true, unique: true, trim: true },
        kind: {
          type: String,
          enum: ["magazine", "book", "notice", "video", "audio", "other"],
          default: "magazine",
        },
        title: { type: localized(true), required: true },
        description: { type: localized(false), default: { en: "", ml: "" } },
        coverImage: { type: String, default: "" },
        fileKey: { type: String, default: "" },
        fileUrl: { type: String, default: "" },
        issueNo: { type: String, default: "" },
        publishedAt: { type: Date },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
      },
      { timestamps: true }
    )
  );

export const ContactMessage =
  mongoose.models.ContactMessage ??
  mongoose.model(
    "ContactMessage",
    new Schema(
      {
        name: { type: String, required: true, maxlength: 100 },
        email: { type: String, default: "", maxlength: 160 },
        phone: { type: String, default: "", maxlength: 20 },
        subject: { type: String, required: true, maxlength: 160 },
        message: { type: String, required: true, maxlength: 5000 },
        locale: { type: String, enum: ["en", "ml"], default: "en" },
        status: {
          type: String,
          enum: ["new", "read", "replied", "spam"],
          default: "new",
        },
      },
      { timestamps: true }
    )
  );

export const MediaAsset =
  mongoose.models.MediaAsset ??
  mongoose.model(
    "MediaAsset",
    new Schema(
      {
        key: { type: String, required: true, unique: true },
        cdnUrl: { type: String, required: true },
        mime: { type: String, required: true },
        size: { type: Number, required: true },
        width: Number,
        height: Number,
        alt: { type: localized(false), default: { en: "", ml: "" } },
        tags: { type: [String], default: [] },
        uploadedBy: { type: String, default: "" },
      },
      { timestamps: true }
    )
  );
