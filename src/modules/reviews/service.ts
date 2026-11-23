import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function createReview(params: {
  orderId: string;
  customerId: string;
  rating: number;
  comment: string;
}) {
  if (params.rating < 1 || params.rating > 5) {
    throw new Error("Rating harus antara 1 sampai 5 bintang.");
  }
  if (!params.comment || params.comment.trim().length < 5) {
    throw new Error("Ulasan minimal 5 karakter.");
  }

  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, params.orderId),
  });

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.customerId !== params.customerId) throw new Error("Akses ditolak.");
  if (order.status !== "COMPLETED") {
    throw new Error("Ulasan hanya dapat diberikan untuk pesanan yang telah selesai.");
  }

  // Check if review already exists
  const existingReview = await db.query.reviews.findFirst({
    where: eq(schema.reviews.orderId, params.orderId),
  });
  if (existingReview) {
    throw new Error("Anda sudah memberikan ulasan untuk pesanan ini.");
  }

  const reviewId = `rev-${Date.now()}`;

  await db.transaction(async (tx) => {
    await tx.insert(schema.reviews).values({
      id: reviewId,
      orderId: order.id,
      customerId: params.customerId,
      technicianId: order.technicianId,
      rating: params.rating,
      comment: params.comment.trim(),
      moderationStatus: "PUBLISHED",
    });

    // Recalculate technician rating dynamically from actual database reviews
    const allReviews = await tx
      .select({ rating: schema.reviews.rating })
      .from(schema.reviews)
      .where(
        and(
          eq(schema.reviews.technicianId, order.technicianId),
          eq(schema.reviews.moderationStatus, "PUBLISHED")
        )
      );

    const totalCount = allReviews.length;
    const avgRating =
      totalCount > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
        : 0;

    await tx
      .update(schema.technicianProfiles)
      .set({
        averageRating: avgRating.toFixed(2),
        reviewCount: totalCount,
        updatedAt: new Date(),
      })
      .where(eq(schema.technicianProfiles.userId, order.technicianId));

    // Notify technician
    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: order.technicianId,
      type: "REVIEW_RECEIVED",
      title: "Ulasan Baru Diterima",
      body: `Pelanggan memberikan rating bintang ${params.rating} untuk pesanan ${order.orderNumber}.`,
      entityType: "review",
      entityId: reviewId,
    });
  });

  return { reviewId };
}

export async function getReviewsForTechnician(technicianId: string) {
  return await db.query.reviews.findMany({
    where: and(
      eq(schema.reviews.technicianId, technicianId),
      eq(schema.reviews.moderationStatus, "PUBLISHED")
    ),
    with: {
      customer: true,
      order: true,
    },
    orderBy: [desc(schema.reviews.createdAt)],
  });
}

