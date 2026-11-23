import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getTechnicians(categorySlug?: string) {
  const query = db.query.technicianProfiles.findMany({
    where: eq(schema.technicianProfiles.verificationStatus, "VERIFIED"),
    with: {
      user: {
        with: {
          technicianServices: {
            with: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: [desc(schema.technicianProfiles.averageRating)],
  });

  const techs = await query;

  if (!categorySlug) {
    return techs;
  }

  // Filter technicians who have services under this category
  return techs.filter((t) =>
    t.user.technicianServices.some((s) => s.category.slug === categorySlug)
  );
}

export async function getTechnicianBySlug(slug: string) {
  const profile = await db.query.technicianProfiles.findFirst({
    where: eq(schema.technicianProfiles.slug, slug),
    with: {
      user: {
        with: {
          technicianServices: {
            where: eq(schema.technicianServices.isActive, true),
            with: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!profile) return null;

  // Fetch reviews for this technician
  const reviews = await db.query.reviews.findMany({
    where: and(
      eq(schema.reviews.technicianId, profile.userId),
      eq(schema.reviews.moderationStatus, "PUBLISHED")
    ),
    with: {
      customer: true,
    },
    orderBy: [desc(schema.reviews.createdAt)],
  });

  return {
    ...profile,
    reviews,
  };
}

export async function getTechnicianByUserId(userId: string) {
  return await db.query.technicianProfiles.findFirst({
    where: eq(schema.technicianProfiles.userId, userId),
    with: {
      user: true,
    },
  });
}

