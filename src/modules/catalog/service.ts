import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, and, ilike, or } from "drizzle-orm";

export async function getCategories() {
  return await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.isActive, true))
    .orderBy(schema.categories.sortOrder);
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getServicesByCategory(categoryId: string) {
  return await db.query.technicianServices.findMany({
    where: and(
      eq(schema.technicianServices.categoryId, categoryId),
      eq(schema.technicianServices.isActive, true)
    ),
    with: {
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
    },
    orderBy: [desc(schema.technicianServices.createdAt)],
  });
}

export async function getFeaturedServices() {
  return await db.query.technicianServices.findMany({
    where: eq(schema.technicianServices.isActive, true),
    with: {
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
    },
    limit: 6,
    orderBy: [desc(schema.technicianServices.createdAt)],
  });
}

export async function getServiceById(id: string) {
  return await db.query.technicianServices.findFirst({
    where: eq(schema.technicianServices.id, id),
    with: {
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
    },
  });
}

export async function searchServicesAndTechnicians(query: string, categorySlug?: string) {
  const allServices = await db.query.technicianServices.findMany({
    where: eq(schema.technicianServices.isActive, true),
    with: {
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
    },
  });

  return allServices.filter((s) => {
    const matchesCategory = categorySlug ? s.category.slug === categorySlug : true;
    const matchesQuery = query
      ? s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.technician.name.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesCategory && matchesQuery;
  });
}

