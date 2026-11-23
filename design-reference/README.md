# Design reference index

The PNG boards are generated visual direction. They contain illustrative placeholder text and data; use `DESIGN.md` as the authoritative specification.

- `01-homepage-responsive.png`: public home page desktop and mobile, category cards, technicians, popular services.
- `02-full-pages-design-board.png`: categories, technician profile, service detail, design system, flow, architecture.
- `03-page-flow-and-dashboard-board.png`: customer order detail/checkout, technician dashboard, technician create-order form, admin dashboard, mobile app layouts, design system.

Page mapping to `DESIGN.md`:
- P01–P05: public home, categories, search results, profile, service detail.
- P06: authentication.
- P07–P12: customer dashboard, orders, order detail, checkout, receipt, review.
- P13–P19: technician dashboard, order list/detail, create order, service catalog, profile editor, reviews, earnings.
- P20–P29: admin pages, moderation, commission settings, audit, legal/help.

Important overrides: technician profile catalog tiles show **no prices**. Service detail/listing pages can show the labor-only base price. Customer never sees commission or technician net. Generated imagery may depict inaccurate labels or pricing; do not copy these into production.
