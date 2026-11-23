import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  numeric,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * 1. Users Table (Compatible with Better Auth + Fixlix roles)
 */
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    phone: text("phone"),
    role: text("role", { enum: ["CUSTOMER", "TECHNICIAN", "ADMIN"] })
      .notNull()
      .default("CUSTOMER"),
    status: text("status", { enum: ["ACTIVE", "SUSPENDED", "DELETED"] })
      .notNull()
      .default("ACTIVE"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("user_email_idx").on(table.email),
    index("user_role_idx").on(table.role),
  ]
);

/**
 * 2. Better Auth Session Table
 */
export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_idx").on(table.userId)]
);

/**
 * 3. Better Auth Account Table (Credentials, OAuth, etc.)
 */
export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("account_user_idx").on(table.userId)]
);

/**
 * 4. Better Auth Verification Table
 */
export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

/**
 * 5. Technician Profiles
 */
export const technicianProfiles = pgTable(
  "technician_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    bio: text("bio").notNull(),
    whatsappPhone: text("whatsapp_phone").notNull(), // e.g. 628123456789
    serviceAreaText: text("service_area_text"), // e.g. "Jakarta Selatan, Depok, Tangerang"
    verificationStatus: text("verification_status", {
      enum: ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"],
    })
      .notNull()
      .default("PENDING"),
    profileImageKey: text("profile_image_key"),
    averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0.00"),
    reviewCount: integer("review_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tech_profile_slug_idx").on(table.slug),
    index("tech_verification_idx").on(table.verificationStatus),
  ]
);

/**
 * 6. Categories (5 initial: Rice Cooker, Fan, TV, AC, Refrigerator)
 */
export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    imageKey: text("image_key"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("category_slug_idx").on(table.slug)]
);

/**
 * 7. Technician Services (Catalog items)
 */
export const technicianServices = pgTable(
  "technician_services",
  {
    id: text("id").primaryKey(),
    technicianId: text("technician_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    laborBasePrice: bigint("labor_base_price", { mode: "number" }).notNull(), // Integer Rupiah
    imageKey: text("image_key"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("tech_service_tech_cat_idx").on(table.technicianId, table.categoryId),
    uniqueIndex("tech_service_slug_idx").on(table.technicianId, table.slug),
  ]
);

/**
 * 8. Portfolio Items
 */
export const portfolioItems = pgTable(
  "portfolio_items",
  {
    id: text("id").primaryKey(),
    technicianId: text("technician_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imageKey: text("image_key").notNull(),
    caption: text("caption"),
    sortOrder: integer("sort_order").notNull().default(0),
    moderationStatus: text("moderation_status", {
      enum: ["PENDING", "PUBLISHED", "HIDDEN"],
    })
      .notNull()
      .default("PUBLISHED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("portfolio_tech_idx").on(table.technicianId)]
);

/**
 * 9. Orders
 */
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(), // e.g. FX-202611-0001
    customerId: text("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    technicianId: text("technician_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    serviceId: text("service_id").references(() => technicianServices.id, {
      onDelete: "set null",
    }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    origin: text("origin", {
      enum: ["DIRECT_SERVICE", "TECHNICIAN_CUSTOM"],
    }).notNull(),
    status: text("status", {
      enum: [
        "PENDING_CUSTOMER_APPROVAL",
        "REJECTED",
        "AWAITING_PAYMENT",
        "PAID",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "PAYMENT_FAILED",
      ],
    }).notNull(),
    deviceName: text("device_name").notNull(),
    description: text("description").notNull(),
    // Monetary breakdown (Integer Rupiah)
    laborFee: bigint("labor_fee", { mode: "number" }).notNull(),
    partsTotal: bigint("parts_total", { mode: "number" }).notNull().default(0),
    otherCharges: bigint("other_charges", { mode: "number" }).notNull().default(0),
    customerTotal: bigint("customer_total", { mode: "number" }).notNull(),
    commissionRateSnapshot: numeric("commission_rate_snapshot", {
      precision: 5,
      scale: 4,
    }).notNull(),
    commissionAmount: bigint("commission_amount", { mode: "number" }).notNull(),
    technicianNet: bigint("technician_net", { mode: "number" }).notNull(),

    // Notes
    technicianNotes: text("technician_notes"),
    customerNotes: text("customer_notes"),
    rejectionReason: text("rejection_reason"),

    // Timestamps
    customerAcceptedAt: timestamp("customer_accepted_at"),
    customerRejectedAt: timestamp("customer_rejected_at"),
    paymentPaidAt: timestamp("payment_paid_at"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("order_number_idx").on(table.orderNumber),
    index("order_customer_idx").on(table.customerId, table.createdAt),
    index("order_tech_idx").on(table.technicianId, table.createdAt),
    index("order_status_idx").on(table.status, table.createdAt),
  ]
);

/**
 * 10. Order Spareparts (Itemized parts)
 */
export const orderSpareparts = pgTable(
  "order_spareparts",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: bigint("unit_price", { mode: "number" }).notNull(),
    subtotal: bigint("subtotal", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("order_spareparts_order_idx").on(table.orderId)]
);

/**
 * 11. Order Additional Charges
 */
export const orderAdditionalCharges = pgTable(
  "order_additional_charges",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("order_add_charges_order_idx").on(table.orderId)]
);

/**
 * 12. Order Attachments
 */
export const orderAttachments = pgTable(
  "order_attachments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    kind: text("kind", {
      enum: ["BEFORE", "PART", "DURING", "AFTER", "OTHER"],
    })
      .notNull()
      .default("OTHER"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("order_attachment_order_idx").on(table.orderId)]
);

/**
 * 13. Order Status History (Audit trail of status changes)
 */
export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("order_history_order_idx").on(table.orderId, table.createdAt)]
);

/**
 * 14. Payments (Simulated)
 */
export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: "restrict" }),
    paymentMethod: text("payment_method", {
      enum: ["SIMULATED_QRIS", "SIMULATED_BANK_TRANSFER", "SIMULATED_EWALLET"],
    }).notNull(),
    referenceNumber: text("reference_number").notNull().unique(), // e.g. PAY-202611-987654
    amount: bigint("amount", { mode: "number" }).notNull(),
    status: text("status", {
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
    })
      .notNull()
      .default("PAID"),
    paidAt: timestamp("paid_at").defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("payment_order_idx").on(table.orderId),
    uniqueIndex("payment_ref_idx").on(table.referenceNumber),
  ]
);

/**
 * 15. Reviews (One review per completed order)
 */
export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: "cascade" }),
    customerId: text("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    technicianId: text("technician_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    rating: integer("rating").notNull(), // 1 to 5
    comment: text("comment").notNull(),
    moderationStatus: text("moderation_status", {
      enum: ["PENDING", "PUBLISHED", "HIDDEN"],
    })
      .notNull()
      .default("PUBLISHED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("review_order_idx").on(table.orderId),
    index("review_tech_idx").on(table.technicianId, table.createdAt),
  ]
);

/**
 * 16. In-App Notifications
 */
export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // ORDER_CREATED, ORDER_APPROVED, ORDER_PAID, etc.
    title: text("title").notNull(),
    body: text("body").notNull(),
    entityType: text("entity_type"), // 'order', 'review', etc.
    entityId: text("entity_id"),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notif_user_read_idx").on(table.userId, table.readAt),
    index("notif_user_created_idx").on(table.userId, table.createdAt),
  ]
);

/**
 * 17. Platform Settings
 */
export const platformSettings = pgTable("platform_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 18. Commission Rate History (Versioned audit of commission rate changes)
 */
export const commissionRateHistory = pgTable("commission_rate_history", {
  id: text("id").primaryKey(),
  rate: numeric("rate", { precision: 5, scale: 4 }).notNull(),
  effectiveAt: timestamp("effective_at").notNull().defaultNow(),
  changedBy: text("changed_by").references(() => users.id, { onDelete: "set null" }),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 19. Audit Logs
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_created_idx").on(table.createdAt),
    index("audit_actor_idx").on(table.actorId, table.createdAt),
  ]
);

/**
 * Drizzle Relations
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  technicianProfile: one(technicianProfiles, {
    fields: [users.id],
    references: [technicianProfiles.userId],
  }),
  customerOrders: many(orders, { relationName: "customerOrders" }),
  technicianOrders: many(orders, { relationName: "technicianOrders" }),
  technicianServices: many(technicianServices),
  notifications: many(notifications),
}));

export const technicianProfilesRelations = relations(technicianProfiles, ({ one }) => ({
  user: one(users, {
    fields: [technicianProfiles.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(technicianServices),
  orders: many(orders),
}));

export const technicianServicesRelations = relations(technicianServices, ({ one, many }) => ({
  technician: one(users, {
    fields: [technicianServices.technicianId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [technicianServices.categoryId],
    references: [categories.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: "customerOrders",
  }),
  technician: one(users, {
    fields: [orders.technicianId],
    references: [users.id],
    relationName: "technicianOrders",
  }),
  service: one(technicianServices, {
    fields: [orders.serviceId],
    references: [technicianServices.id],
  }),
  category: one(categories, {
    fields: [orders.categoryId],
    references: [categories.id],
  }),
  spareparts: many(orderSpareparts, { relationName: "orderSpareparts" }),
  additionalCharges: many(orderAdditionalCharges, { relationName: "orderAdditionalCharges" }),
  attachments: many(orderAttachments, { relationName: "orderAttachments" }),
  statusHistory: many(orderStatusHistory, { relationName: "orderStatusHistory" }),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
  review: one(reviews, {
    fields: [orders.id],
    references: [reviews.orderId],
  }),
}));

export const orderSparepartsRelations = relations(orderSpareparts, ({ one }) => ({
  order: one(orders, {
    fields: [orderSpareparts.orderId],
    references: [orders.id],
    relationName: "orderSpareparts",
  }),
}));

export const orderAdditionalChargesRelations = relations(orderAdditionalCharges, ({ one }) => ({
  order: one(orders, {
    fields: [orderAdditionalCharges.orderId],
    references: [orders.id],
    relationName: "orderAdditionalCharges",
  }),
}));

export const orderAttachmentsRelations = relations(orderAttachments, ({ one }) => ({
  order: one(orders, {
    fields: [orderAttachments.orderId],
    references: [orders.id],
    relationName: "orderAttachments",
  }),
  uploadedByUser: one(users, {
    fields: [orderAttachments.uploadedBy],
    references: [users.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
    relationName: "orderStatusHistory",
  }),
  actor: one(users, {
    fields: [orderStatusHistory.actorId],
    references: [users.id],
  }),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  technician: one(users, {
    fields: [portfolioItems.technicianId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  customer: one(users, {
    fields: [reviews.customerId],
    references: [users.id],
  }),
  technician: one(users, {
    fields: [reviews.technicianId],
    references: [users.id],
  }),
}));

