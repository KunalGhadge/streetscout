# Street Scout — Agent Worklog

---
Task ID: 7
Agent: full-stack-developer
Task: Build admin panel UI

Work Log:
- Read existing context: prisma schema (Product, Universe, Drop, Lifestyle models), all admin API routes (login, auth-check, logout, products CRUD, universes CRUD, drops CRUD, lifestyle CRUD, upload), the existing ImageUpload component, useToast hook, globals.css (font-display, font-mono-tech, font-jp, grid-overlay utilities), and types.ts.
- Created `/home/z/my-project/src/components/admin/admin-panel.tsx` — a single 'use client' component containing the full admin experience:
  - **Login screen**: full-screen `#050505` overlay with `grid-overlay` texture, "STREET SCOUT ADMIN" heading in font-display, Japanese subtitle "管理パネル", password input (dark `#0a0a0a` bg, `#2A2A2A` border, focus `#FF2D55`), accent `#FF2D55` login button with loading spinner, error display, Enter-to-submit, close button.
  - **Auth check on mount**: GET `/api/admin/auth-check` — skips login if already authenticated. Splash "Verifying session..." while checking. No hydration errors (auth state only rendered after useEffect).
  - **Dashboard**: fixed `inset-0` `z-[200]` overlay with `overflow-y-auto`, sticky top bar (back button, "STREET SCOUT ADMIN" + "管理パネル", logout button), left sidebar that collapses to a horizontal scrollable tab strip on mobile (`flex` on mobile → `md:flex-col md:w-56`).
  - **Tabs**: Products (商品/Package icon), Universes (宇宙/Globe), Drops (ドロップ/Layers), Lifestyle (生活/Sparkles).
  - **Products tab**: "Add New Product" button, table with thumbnail / name+slug / universe+jp / price (formatINR ₹) / drop number / featured toggle (click to flip via PUT) / edit+delete buttons. Responsive grid collapses cleanly on mobile. Edit form covers ALL product fields: name, slug, collection, collectionTag, dropNumber, universe, universeJp, price, description, fabric, fit, breathability, durability, imageFront (ImageUpload), imageBack (ImageUpload), isFeatured toggle, inStock toggle. CRUD via POST/PUT/DELETE on `/api/admin/products`.
  - **Universes tab**: card grid with thumbnail, name, japanese, dropNumber, order; edit form with name, japanese, dropNumber, image (ImageUpload), order; CRUD on `/api/admin/universes`.
  - **Drops tab**: card grid with thumbnail, number (accent), japanese, title, status badge; edit form with number, japanese, title, description, status dropdown (AVAILABLE/LIMITED), image (ImageUpload), order; CRUD on `/api/admin/drops`.
  - **Lifestyle tab**: card grid with thumbnail, tag (accent), label, japanese; edit form with label, japanese, tag, description, image (ImageUpload), order; CRUD on `/api/admin/lifestyle`.
  - **Confirm dialog**: custom `ConfirmDialog` overlay (z-[300]) with AlertTriangle icon, used for every delete — no native `window.confirm`.
  - **Toast notifications**: success toasts on every create/update/delete, error toasts on failure (using `useToast` from `@/hooks/use-toast`, Toaster already mounted in layout).
  - **Loading states**: spinners on every async button (login, save, delete, logout, list fetch, featured toggle).
  - **Shared primitives**: `Field`, `TextInput`, `TextArea`, `Toggle`, `PrimaryButton`, `SecondaryButton`, `FormShell`, `SectionTitle`, `EmptyState`, `Thumb` — all using the dark premium palette (`#050505` bg, `#111111` surface, `#2A2A2A` border, `#F5F5F5` text, `#FF2D55` accent, font-mono-tech for technical labels, font-jp for Japanese accents).
  - **Refresh after CRUD**: every save/delete re-fetches the active list via a `useCallback` fetch function.
- Ran `bun run lint` — 0 errors, 0 warnings on the new file. Removed an unused eslint-disable directive after the first pass. (4 unrelated warnings remain in pre-existing site components — not in scope.)
- Verified dev server compiled the file cleanly (`✓ Compiled in 249ms`).

Stage Summary:
- A complete, production-ready admin panel exists at `/home/z/my-project/src/components/admin/admin-panel.tsx` exposing a single `AdminPanel` component with `{ onClose: () => void }` props.
- The panel handles authentication (login → auth-check → dashboard → logout) and full CRUD for Products, Universes, Drops, and Lifestyle models via the existing `/api/admin/*` routes, using the existing `ImageUpload` component for every image field and `formatINR` for price display.
- Design matches the site's premium dark aesthetic (bg `#050505`, surface `#111111`, border `#2A2A2A`, accent `#FF2D55`), with `font-display` headings, `font-mono-tech` technical labels, Japanese text accents, responsive sidebar that collapses to top tabs on mobile, and consistent loading/toast/confirm states.
- The component is a pure client-side overlay and creates no new routes; it can be rendered directly inside `src/app/page.tsx` as a fixed overlay when the admin enters the site.

---
Task ID: 7-b
Agent: full-stack-developer
Task: Add Coupons, Store Status, and Notifications tabs to existing admin panel

Work Log:
- Read `/home/z/my-project/worklog.md` and the existing `/home/z/my-project/src/components/admin/admin-panel.tsx` (~1926 lines) to understand the patterns used by previous agent (Task 7): shared primitives (`Field`, `TextInput`, `TextArea`, `Toggle`, `PrimaryButton`, `SecondaryButton`, `FormShell`, `SectionTitle`, `EmptyState`, `Thumb`, `ConfirmDialog`), dark premium palette (#050505 bg / #111111 surface / #2A2A2A border / #F5F5F5 text / #FF2D55 accent), `useToast` for feedback, `useCallback` fetch + `useEffect` refresh pattern, responsive sidebar that collapses to a horizontal scrollable tab strip on mobile.
- Verified the 3 new admin API routes already exist: `src/app/api/admin/coupons/{route.ts,[id]/route.ts}`, `src/app/api/admin/store-status/route.ts`, `src/app/api/admin/notifications/{route.ts,[id]/route.ts}`.
- Made targeted edits to `src/components/admin/admin-panel.tsx` (now 2847 lines):
  1. **Imports**: Added `Tag`, `Power`, `Bell` to the lucide-react import list (3 new icons).
  2. **TabId type**: Changed from 4-value string union to 7-value union (`'products' | 'universes' | 'drops' | 'lifestyle' | 'coupons' | 'store' | 'notifications'`), formatted as multi-line for readability.
  3. **Types**: Added three interfaces right after `TabId`: `Coupon` (id, code, description, type, value, giftName, minOrder, isActive, expiresAt, createdAt), `StoreStatus` (id?, accepting, message), `AdminNotification` (id, title, body, type, link, isActive, createdAt).
  4. **TABS array**: Added 3 new entries after Lifestyle — `{ id: 'coupons', label: 'Coupons', jp: 'クーポン', icon: Tag }`, `{ id: 'store', label: 'Store', jp: 'ストア', icon: Power }`, `{ id: 'notifications', label: 'Alerts', jp: '通知', icon: Bell }`.
  5. **CouponForm component** (added after LifestyleForm, before Thumb helper): FormShell wrapper with title `Edit Coupon`/`New Coupon` + jp `クーポン編集`/`新クーポン`. Fields in a 2-col grid: Code (TextInput, auto-uppercases via `v.toUpperCase()` on change, placeholder `SUMMER10`), Type (select with DISCOUNT/FREE_SHIPPING/FREE_GIFT options), Description (full-width TextInput), Value (number, only rendered when `type==='DISCOUNT'`, hint "Percentage off (e.g. 10 = 10% off)"), Gift Name (TextInput, only rendered when `type==='FREE_GIFT'`), Min Order (number, hint "Minimum cart total to apply (0 = no minimum)"), Expires At (native `datetime-local` input, hint "Optional · leave empty for no expiry"), Active (Toggle). Initial form state seeded from `Coupon | null` — `expiresAt` sliced to first 16 chars to fit datetime-local format.
  6. **NotificationForm component**: FormShell with title `Edit Notification`/`New Notification` + jp `通知編集`/`新通知`. Single-column grid with: Title (TextInput), Body (TextArea, 4 rows), Type (select with INFO/OFFER/COUPON/WARNING), Link (TextInput, hint "URL to navigate when clicked (e.g. #featured)"), Active (Toggle).
  7. **CouponsTab component**: Full CRUD list view following the ProductsTab pattern (table-style on desktop, header row with col-span labels for Code/Type/Value/Min Order/Active/Actions, mobile collapses to 12-col grid). Per-row: code + description, type badge color-coded (DISCOUNT = white border, FREE_SHIPPING = `#22c55e` green, FREE_GIFT = `#FF2D55` pink), value column shows `{value}%` for DISCOUNT / giftName for FREE_GIFT / em-dash for FREE_SHIPPING, min order formatted via `formatINR`, Active toggle button (click-to-flip via PUT, optimistic local update), edit + delete icon buttons. `handleSave` builds a payload that converts `value`/`minOrder` to numbers and `expiresAt` to ISO string (or `null` if empty). ConfirmDialog for deletes, EmptyState when no coupons, Loader2 spinner while fetching.
  8. **StoreStatusTab component**: Single-panel editor (not a list). Fetches from `GET /api/admin/store-status` into local `accepting` (boolean) + `message` (string) state — local state only, persisted on Save button click via `PUT /api/admin/store-status` with `{ accepting, message }`. Layout: 2-col grid on lg, single col on mobile. Left card = editor: a large custom toggle ("Accepting Orders" / `注文受付`) styled with `#FF2D55` when on / `#2A2A2A` when off, a "Paused Message" TextArea (auto-disabled with `pointer-events-none opacity-40` when accepting), and a "Save Status" PrimaryButton. Right card = live preview that shows a green "Store is open" card when accepting, or a pink "Orders paused" card with the AlertTriangle icon + custom message when not accepting. Loader2 spinner while loading initial status.
  9. **NotificationsTab component**: Full CRUD list view following the UniversesTab card-list pattern (vertical stack, not table). Each notification card shows: type badge (color-coded: INFO = white border, OFFER = `#FF2D55` pink, COUPON = `#22c55e` green, WARNING = `#FF2D55` pink), title (truncate), body (line-clamp-2), optional link with `→` prefix, created date via `new Date(createdAt).toLocaleString()`, and a right-aligned action cluster with Active toggle button + edit + delete icon buttons. ConfirmDialog for deletes, EmptyState + Loader2 spinner. `handleToggleActive` uses PUT with `{...n, isActive: !n.isActive}`.
  10. **Main dashboard render**: Added 3 conditional renders after the Lifestyle render: `{activeTab === 'coupons' && <CouponsTab />}`, `{activeTab === 'store' && <StoreStatusTab />}`, `{activeTab === 'notifications' && <NotificationsTab />}`. The 3 new tabs automatically appear in the sidebar because the sidebar renders from the TABS array — they show up below Lifestyle on desktop (vertical sidebar) and as additional horizontally-scrollable buttons on mobile.
- Ran `cd /home/z/my-project && bun run lint` — 0 errors, 0 warnings on the modified file.
- Verified TypeScript via `npx tsc --noEmit` — no errors in `src/components/admin/admin-panel.tsx` (only pre-existing unrelated errors in `examples/` and `skills/` folders, which are out of scope).
- Verified dev server compiled the modified file cleanly (`✓ Compiled in 220ms` and `✓ Compiled in 176ms` appear in `dev.log`).
- Restored the `Thumb` helper function after an accidental over-edit during insertion (verified intact at its original location between LifestyleForm and CouponForm).

Stage Summary:
- The admin panel now exposes 7 tabs total: the original 4 (Products, Universes, Drops, Lifestyle) plus 3 new ones (Coupons, Store, Alerts) wired to the existing `/api/admin/coupons`, `/api/admin/store-status`, and `/api/admin/notifications` routes.
- All 3 new tabs follow the exact same patterns as the existing 4 tabs: dark premium palette, `font-mono-tech` technical labels, `font-jp` Japanese accents, `useToast` for success/error feedback, `ConfirmDialog` for deletes, `Loader2` spinners for async states, optimistic active-toggle updates, and refresh-after-CRUD via `useCallback` fetch.
- The Coupons and Notifications forms use the shared `FormShell` wrapper so the UX matches the existing product/universe/drop/lifestyle forms (same header with title + jp label, scrollable content area, fixed footer with Cancel + Save buttons, save-button loading spinner).
- The Store Status tab is a custom single-panel editor with a live user-facing preview, distinct from the list-style tabs — appropriate because store status is a singleton record.
- No existing functionality was broken: the 4 original tabs and the auth flow (login → auth-check → dashboard → logout) are untouched. All edits were surgical additions, not rewrites.

---
Task ID: 7-c
Agent: full-stack-developer
Task: Add 3 admin-panel improvements — dropdown suggestions in ProductForm, usage-limit field on coupons, and a Settings tab for WhatsApp number

Work Log:
- Read `/home/z/my-project/worklog.md` (Tasks 7 and 7-b context) and the existing `/home/z/my-project/src/components/admin/admin-panel.tsx` (2847 lines) to understand established patterns: shared primitives (`Field`, `TextInput`, `TextArea`, `Toggle`, `PrimaryButton`, `SecondaryButton`, `FormShell`, `SectionTitle`, `EmptyState`, `Thumb`, `ConfirmDialog`), dark premium palette (#050505 bg / #111111 surface / #2A2A2A border / #F5F5F5 text / #FF2D55 accent), `useToast` for feedback, `useCallback` fetch + `useEffect` refresh, sidebar that collapses to a horizontal scrollable tab strip on mobile, and the existing inline `<select>` style used in CouponForm/NotificationForm.
- Verified backend support already exists: `prisma/schema.prisma` has `Coupon.usageLimit Int @default(0)` + `Coupon.usedCount Int @default(0)`; `POST /api/admin/coupons` and `PUT /api/admin/coupons/[id]` already accept `usageLimit` (parsed via `parseInt`); `GET/PUT /api/admin/settings` returns/upserts a key-value `Setting` table (so `whatsapp_number` is supported).
- Made targeted edits to `src/components/admin/admin-panel.tsx` (now 3121 lines, +274 lines):

  **Change 1 — Dropdown suggestions in ProductForm**
  1. Added a new `SelectWithCustom` helper component (right after `emptyProductForm`) — a `<select>` with optional empty placeholder option, a list of preset `{value,label}` options, and a `+ Custom...` option (`__custom` sentinel). When the current value matches a preset, that preset is shown as selected. When the value is non-empty and not a preset, the select shows `__custom` and a TextInput appears below for free-form entry. The `<select>` uses the exact dark-theme styling requested (`border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/80 focus:border-[#FF2D55] focus:outline-none`).
  2. Added three preset arrays: `UNIVERSE_PRESETS` (Naruto, One Piece, Jujutsu Kaisen, Attack on Titan, Demon Slayer, Solo Leveling), `COLLECTION_TAG_PRESETS` (NARUTO/ONE PIECE/JJK/AOT/DEMON SLAYER/SOLO LEVELING COLLECTION), `DROP_NUMBER_PRESETS` (DROP-001..DROP-006).
  3. Replaced the three `TextInput`s in ProductForm with `SelectWithCustom`:
     - **Collection Tag**: `selectPlaceholder="Select tag..."`, custom placeholder `SS-001`.
     - **Drop Number**: `includeEmptyOption={false}` (no empty placeholder — defaults to DROP-001), custom placeholder `DROP-007`.
     - **Universe**: `selectPlaceholder="Select universe..."`, custom placeholder `Naruto`.
  4. Existing edit flows keep working: if a product's stored value is a preset, the select shows it directly; if it's a custom value (e.g., a "Bleach" universe from a prior manual entry), the select auto-switches to `__custom` mode and pre-fills the TextInput with that value.

  **Change 2 — Usage Limit on coupons**
  1. Extended the `Coupon` interface with two new fields: `usageLimit: number` and `usedCount: number` (both already returned by the backend; previously missing from the TS interface).
  2. Added `usageLimit: '0'` (string) to the `CouponFormData` interface and `emptyCouponForm()` factory.
  3. Seeded `usageLimit: String(item.usageLimit || 0)` when initializing the form from an existing coupon.
  4. Added a new "Usage Limit" `Field` UI directly after "Min Order" in `CouponForm`, with hint `0 = unlimited, N = first N users only (e.g. 10 = first 10 customers)` and a number-typed TextInput.
  5. Added `usageLimit: parseInt(data.usageLimit) || 0` to the save payload in `CouponsTab.handleSave`.
  6. Added a new "Usage" column to the coupons list table (between "Min Order" and "Active"). Adjusted desktop col-spans to keep the 12-col grid balanced: Code(3) · Type(2) · Value(1, was 2) · Min Order(1, was 2) · Usage(2, new) · Active(1) · Actions(2) = 12. On mobile, the Usage cell takes `col-span-12` so it gets its own row. Display logic: if `usageLimit > 0` show `{usedCount}/{usageLimit} used` (e.g. `3/10 used`) in mono-tech text; otherwise show `Unlimited` in muted text.

  **Change 3 — Settings tab**
  1. Added `Settings` to the `lucide-react` import list.
  2. Added `'settings'` to the `TabId` union type (now 8 values).
  3. Added `{ id: 'settings', label: 'Settings', jp: '設定', icon: Settings }` to the `TABS` array (at the bottom — automatically renders last in both the desktop sidebar and the mobile horizontal tab strip).
  4. Created a `SettingsTab` component (placed between `NotificationsTab` and the main `AdminPanel` export):
     - Fetches `GET /api/admin/settings` (returns a `Record<string,string>` like `{ whatsapp_number: "918451818607" }`) on mount via `useCallback` + `useEffect`.
     - Local state: `whatsapp` (string), `loading`, `saving`.
     - Layout: 2-col grid on lg, single column on mobile. Left card = editor with a "WhatsApp Number" `Field` (TextInput, placeholder `918451818607`, hint `Include country code, no + or spaces. Example: 918451818607 for +91 8451818607`) + a "Save Settings" PrimaryButton. Right card = live preview that shows a green-bordered "Orders will be sent to: +91 8451818607" card when a number is set, or a pink-bordered "No number set" warning card (with AlertTriangle icon) when empty.
     - On Save: `PUT /api/admin/settings` with body `{ whatsapp_number: value }`. Shows `useToast` success toast (`Settings saved`) on 2xx, or destructive toast with the API error message on failure.
     - Loader2 spinner while loading initial settings.
  5. Added a `formatWhatsAppDisplay` helper that converts a raw digit string into a friendly display format: `918451818607` → `+91 8451818607`, `8451818607` → `+91 8451818607` (assumes India), other lengths → `+{digits}`. Used by the preview card.
  6. Added `{activeTab === 'settings' && <SettingsTab />}` to the main dashboard render section, after the notifications render.

- Ran `cd /home/z/my-project && bun run lint` — 0 errors, 0 warnings on the modified file.
- Ran `npx tsc --noEmit` — no errors in `src/components/admin/admin-panel.tsx` (only pre-existing unrelated errors in `examples/`, `skills/`, and `src/lib/whatsapp.ts`, which are out of scope).
- Triggered `GET /` on the dev server to force a recompile — `200 OK` with `✓ Compiled in 161ms` and no error trace in `dev.log`.

Stage Summary:
- The admin panel now exposes 8 tabs (the previous 7 plus Settings) and the ProductForm uses dropdown selects with `+ Custom...` fallback for Universe, Collection Tag, and Drop Number — drastically reducing typing for the common case while still allowing arbitrary custom values.
- Coupons now support a `usageLimit` field (0 = unlimited, N = first N customers) end-to-end: form UI, save payload, and a new "Usage" column in the coupons list that shows `{usedCount}/{usageLimit} used` or `Unlimited`. Backend support was already in place (schema + API routes).
- A new Settings tab lets the admin set the store's WhatsApp number (`whatsapp_number` setting) with a live preview of how orders will be routed, persisted via the existing `/api/admin/settings` route. The number is stored as raw digits (e.g. `918451818607`) and displayed as `+91 8451818607` for clarity.
- All edits were surgical additions/modifications — no existing functionality was removed. The 4 original tabs (Products, Universes, Drops, Lifestyle) and the 3 tabs added in Task 7-b (Coupons, Store, Alerts) plus the auth flow (login → auth-check → dashboard → logout) remain fully intact.

---
Task ID: 7-d
Agent: full-stack-developer
Task: Add Affiliates + Affiliate Dashboard tabs to existing admin panel

Work Log:
- Read `/home/z/my-project/worklog.md` (Tasks 7, 7-b, 7-c context) and the existing `/home/z/my-project/src/components/admin/admin-panel.tsx` (3121 lines) to understand established patterns: shared primitives (`Field`, `TextInput`, `TextArea`, `Toggle`, `PrimaryButton`, `SecondaryButton`, `FormShell`, `SectionTitle`, `EmptyState`, `Thumb`, `ConfirmDialog`), dark premium palette (#050505 bg / #111111 surface / #2A2A2A border / #F5F5F5 text / #FF2D55 accent / #22c55e green / #f59e0b amber), `useToast` for feedback, `useCallback` fetch + `useEffect` refresh, responsive sidebar that collapses to a horizontal scrollable tab strip on mobile, and the inline `<select>` style used in CouponForm/NotificationForm.
- Verified the 4 affiliate admin API routes already exist: `src/app/api/admin/affiliates/{route.ts,[id]/route.ts}`, `src/app/api/admin/affiliate-orders/{route.ts,[id]/route.ts}`. Confirmed the backend returns `Affiliate.stats` (computed from joined orders) and supports `DELETE` (which auto-deactivates if confirmed orders exist) and `PUT` for both affiliate records and order status.
- Made targeted edits to `src/components/admin/admin-panel.tsx` (now 4173 lines, +1052 lines):

  **Change 1 — Imports**
  Added `Users` and `BarChart3` to the lucide-react import list (2 new icons).

  **Change 2 — TabId type**
  Extended the union with `'affiliates' | 'affiliateDashboard'` (now 10 values).

  **Change 3 — Types**
  Added two new interfaces right after `AdminNotification`:
  - `Affiliate` (id, code, creatorName, platform, contact, rewardType, rewardValue, rewardGiftName, commissionType, commissionValue, isActive, createdAt, optional nested `stats` object with totalOrders/confirmedOrders/pendingOrders/cancelledOrders/totalRevenue/totalCommission/pendingCommission).
  - `AffiliateOrder` (id, affiliateId, code, creatorName, orderTotal, commissionDue, status, customerNote, createdAt, optional nested `affiliate` object).

  **Change 4 — TABS array**
  Added 2 new entries after Settings: `{ id: 'affiliates', label: 'Affiliates', jp: 'アフィリエイト', icon: Users }` and `{ id: 'affiliateDashboard', label: 'Dashboard', jp: 'ダッシュボード', icon: BarChart3 }`. They render at the bottom of both the desktop sidebar and the mobile horizontal tab strip.

  **Change 5 — AffiliateForm component** (placed after SettingsTab, before the main AdminPanel export)
  FormShell wrapper with title `Edit Affiliate`/`New Affiliate` + jp `アフィリエイト編集`/`新アフィリエイト`. Layout: 2-col grid on md+, single col on mobile. Fields:
  - Code (TextInput, auto-uppercases via `v.toUpperCase()` on change, placeholder `NARUTO10`).
  - Creator Name (TextInput, placeholder `@anime_fan_page`).
  - Platform (select with Instagram / YouTube / TikTok / Twitter/X / Facebook / Other).
  - Contact (TextInput, placeholder `WhatsApp number or email for payout`).
  - Visual separator with pink accent label "Customer Reward · カスタマー特典".
  - Reward Type (select: DISCOUNT / FREE_GIFT / NONE).
  - Conditional field: DISCOUNT → "Reward Value" number input (hint `Percentage off (0–100)`); FREE_GIFT → "Gift Name" text input; NONE → muted hint text "No customer discount — they just support the creator".
  - Visual separator with pink accent label "Creator Commission · クリエイター報酬".
  - Commission Type (select: PERCENTAGE / FIXED).
  - Commission Value (number input, hint dynamically switches between `e.g. 10 for 10% per sale` and `e.g. 100 for ₹100 per sale` based on commissionType).
  - Active (Toggle).
  Initial form state seeded from `Affiliate | null` — numeric fields converted to string via `String(item.x ?? 0)`.
  Empty-form factory defaults: platform `Instagram`, rewardType `DISCOUNT`, rewardValue `10`, commissionType `PERCENTAGE`, commissionValue `10`, isActive `true`.

  **Change 6 — AffiliatesTab component** (creator management, full CRUD list view)
  Follows the NotificationsTab vertical-card-stack pattern (each affiliate is a rich multi-section card). Each card contains:
  - Header row: code (font-mono-tech, bold, uppercase), platform badge (color-coded: Instagram/YouTube = pink, TikTok = green, others = white border), "Paused" badge if inactive, Active/Paused toggle button (click-to-flip via PUT with `{ isActive: !a.isActive }`, optimistic local update), Edit + Delete icon buttons.
  - Creator name (truncated) + contact (mono-tech, muted).
  - 2-column info grid: "Customer Reward · 特典" (computed via `formatRewardLabel` → "10% off" / "Free Gift: Sticker Pack" / "None") and "Creator Commission · 報酬" (computed via `formatCommissionLabel` → "10% per sale" / "₹100 per sale").
  - 4-column stats grid (only rendered if `a.stats` exists): Orders (white), Confirmed (green #22c55e), Revenue (`formatINR`), Commission (`formatINR`, pink #FF2D55).
  `handleSave` builds a payload that converts `rewardValue`/`commissionValue` to numbers via `parseFloat || 0`. `handleDelete` checks the API response: if `data.deactivated === true` it shows an info toast with the backend's `data.message` (about preserving payout history); otherwise shows a standard "deleted" toast. ConfirmDialog before delete with a message explaining the auto-deactivate behavior. Loader2 spinner while fetching, EmptyState when no affiliates.

  **Change 7 — AffiliateDashboardTab component** (campaign overview + order management + per-creator breakdown)
  Three-section layout:
  1. **Top: 4-card Campaign Overview Stats** (2x2 on mobile, 4x1 on lg):
     - Total Revenue (`formatINR(totalRevenue)` from confirmed orders, font-display xl white, sub-label with confirmed order count).
     - Commission Owed (`formatINR(totalCommission)`, pink #FF2D55, sub-label "From confirmed orders").
     - Pending (`formatINR(pendingCommission)`, amber #f59e0b, sub-label with pending order count).
     - Total Orders (count, sub-label "Across N creators" where N = affiliates with >0 orders).
  2. **Middle: Order Management Section**
     - Section header with "Order Management / 注文管理" title + filter button row (ALL / PENDING / CONFIRMED / CANCELLED). Active filter is solid pink `#FF2D55` with white text; inactive filters are bordered `#2A2A2A` with muted text.
     - 12-col grid table on md+ (Date / Creator / Total / Commission / Status / Actions), collapses to stacked rows on mobile.
     - Per-order row: date+time (font-mono-tech), creator name + code (pink), order total (`formatINR`), commission due (`formatINR`), status badge (PENDING = amber, CONFIRMED = green, CANCELLED = pink).
     - Action buttons (per-status): PENDING → "Confirm" (green border + green tint bg) + "Cancel" (pink); CONFIRMED → "Cancel" (pink); CANCELLED → "Reopen" (muted). All show `...` while updating.
     - Each order has a note section below the row: shows existing `customerNote` if set, plus an inline text input to add/edit a note (with a "Save Note" button that appears only when there's input — calls `updateOrderStatus` with the same status, just to persist the note).
     - `updateOrderStatus` calls `PUT /api/admin/affiliate-orders/[id]` with `{ status, customerNote }`, shows toast on success, clears the note input, refetches all data.
     - EmptyState when no orders match the current filter.
  3. **Bottom: Per-Creator Breakdown**
     - Section header "Creator Breakdown / クリエイター別".
     - List of all affiliates (not just active) with: creator name + code (pink) + platform + "Paused" badge if inactive, then a 4-col stat grid: Confirmed (green), Revenue (`formatINR`), Commission Owed (pink), Pending Commission (amber).
     - Right side: "Confirm all pending (N)" green button — disabled when N=0 or while bulk-confirming. `handleBulkConfirm` iterates through all PENDING orders for that affiliate and PUTs each one to CONFIRMED sequentially, then shows a summary toast (`N orders confirmed` or `X confirmed, Y failed`).
  - Uses `Promise.all` to fetch both `/api/admin/affiliate-orders` and `/api/admin/affiliates` in parallel on mount via `useCallback` + `useEffect`.
  - Loader2 spinner while loading initial data.

  **Change 8 — Main dashboard render**
  Added 2 conditional renders after the Settings render:
  - `{activeTab === 'affiliates' && <AffiliatesTab />}`
  - `{activeTab === 'affiliateDashboard' && <AffiliateDashboardTab />}`
  The 2 new tabs automatically appear in the sidebar because the sidebar renders from the TABS array.

- Helper functions added (module-scope, near the components that use them):
  - `formatRewardLabel(a: Affiliate): string` → `${value}% off` / `Free Gift: ${name}` / `None`.
  - `formatCommissionLabel(a: Affiliate): string` → `${value}% per sale` / `${formatINR(value)} per sale`.
  - `platformBadgeStyle(platform: string): string` → pink for IG/YT, green for TikTok, white border default.
  - `orderStatusStyle(status: string): string` → green for CONFIRMED, pink for CANCELLED, amber for PENDING.

- Ran `cd /home/z/my-project && bun run lint` — 0 errors, 0 warnings on the modified file.
- Ran `npx tsc --noEmit` — no errors in `src/components/admin/admin-panel.tsx` (only pre-existing unrelated errors in `examples/`, `skills/` folders, which are out of scope).
- Triggered `GET /` on the dev server to force a recompile — `200 OK` with `✓ Compiled in 52ms` (render: 115ms) and no error trace in `dev.log`.

Stage Summary:
- The admin panel now exposes 10 tabs total: the original 4 (Products, Universes, Drops, Lifestyle) + 3 from Task 7-b (Coupons, Store, Alerts) + Settings from Task 7-c + 2 new ones (Affiliates, Dashboard) wired to the existing `/api/admin/affiliates` and `/api/admin/affiliate-orders` routes.
- The **Affiliates** tab is a full CRUD list view for creator management — each card surfaces the code, platform, contact, reward structure, commission structure, and live order stats; admins can create, edit, toggle active/paused, and delete (with the backend's auto-deactivate-instead-of-delete behavior surfaced in the toast message).
- The **Dashboard** tab is a campaign command center — top-line revenue/commission/pending stats, a filterable order management table with per-order status transitions (Confirm/Cancel/Reopen) + inline note-taking, and a per-creator breakdown with one-click "Confirm all pending" bulk action.
- All new code follows the exact same patterns as the existing 8 tabs: dark premium palette (`#050505` bg / `#111111` surface / `#2A2A2A` border / `#F5F5F5` text / `#FF2D55` accent / `#22c55e` green / `#f59e0b` amber for pending), `font-mono-tech` technical labels, `font-jp` Japanese accents, `useToast` for success/error feedback, `ConfirmDialog` for deletes, `Loader2` spinners for async states, optimistic active-toggle updates, and refresh-after-CRUD via `useCallback` fetch.
- No existing functionality was broken: the 8 original tabs and the auth flow (login → auth-check → dashboard → logout) are untouched. All edits were surgical additions, not rewrites — the only modification to existing code was extending the `TabId` union and the `TABS` array and the lucide-react import list.
