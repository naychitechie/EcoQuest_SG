# Iteration Changes

Please apply the following specific updates to our current mobile layout. Do not break the core mobile frame or our existing API routing links:

- [ ] **Branding Update:** Change the application/website name references to "EcoQuest SG".

- [ ] **Fix Search UI Layout:** Fix the layout issue where the search button is rendering out of the mobile viewport. Reposition it cleanly directly underneath the "Prefer options" section.

- [ ] **Clean Settings Layout:** Completely remove the "Update Password" block and the "Two-Factor Authentication" rows from the Settings component to prioritize localized sustainability configurations.

- [ ] **Expand Settings Component with Localized Controls:**
  Refactor the Settings view to include these three specific sections below the existing appearance options:
  1. **Nudge & Agent Tuning:**
    - Add a "Focus Hours" time picker ("Silence agent notifications during sleep").
    - Add an "LTA Service Alert Sync" toggle ("Allow agent to suggest alternative green routes during train delays").
  2. **Infrastructure Links:**
    - Add an "EZ-Link / SimplyGo Smart Sync" placeholder card. Display a subtle status indicator reading: "Ready for Account CEPAS integration".
  3. **Eco-Goal Calibration:**
    - Implement three responsive slider elements labeled: "Transport Share Goals", "Dietary Carbon Reduction", and "Home Energy Savings".

- [ ] **Display Density Enforcement:**
  Apply a **Compact/High Display Density** format to this expanded settings panel using clean Tailwind dividers `divide-y divide-slate-800`), flat chevron icons, and tight row heights `py-2.5`) to guarantee it reads beautifully like a native Apple/Android system settings menu.

- [ ] **Implement Gamified Impact Statistics Grid:**
  Replace generic dashboard numbers with a high-density, 3-column metric card section reflecting Alex Tan's localized progress:
  1. **Carbon Track:**
    - *Label:* "CO₂ Saved"
    - *Value:* "4.8 kg" 
    - *Subtext:* "+1.2 kg today" (Matches the exact reward from your AMK MRT Sprint quest!)
  2. **Active Transit:**
    - *Label:* "Green Commutes"
    - *Value:* "12 / 15"
    - *Subtext:* "Target: Tier 2"
  3. **Gamification Wealth:**
    - *Label:* "Streak Coins"
    - *Value:* "340"
    - *Subtext:* "+50 Pending" (Matches your Fast-Forward debug state!)

- [ ] **Visual Spacing Rule:** 
  Use a **High (Compact) Display Density** for this stats grid `grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800`). It needs to look like a clean, executive dashboard widget nested right beneath your user profile header.

- [ ] **Refactor Rewards Page for Mobile Display Density:**
  The Rewards page is breaking out of the mobile layout. Refactor the component to fit perfectly inside our strict `max-w-[430px]` centered viewport wrapper using the following layout adjustments:
  1. **Header Layout:** - Reduce the padding of the rewards hero section to `pt-4 pb-2 px-4`.
    - Display the user's current "Streak Coin" balance `340 Coins`) as a sleek, high-contrast floating badge in the upper right corner using `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-semibold`.
  2. **Vouchers & Milestones Grid:**
    - Change the voucher display grid from a wide row/column setup to a high-density, single-column stack `flex flex-col gap-2.5 px-4`).
    - Each reward card item (e.g., "$5 SimplyGo Rebate", "Gong Cha Eco-Cup Discount") must use a horizontal layout: icon on the left, titles/cost in the middle, and a small action button on the right.
  3. **Card Element Details (Compact Density):**
    - Style individual reward items using a low-profile dark card wrapper: `bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between`.
    - Shrink the text sizing to prevent line-wrapping: Titles use `text-sm font-bold`, coin costs use `text-xs text-slate-400`.
    - Action buttons should be minimal, bright capsules: `bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg`.
  4. **Overflow & Layout Safety:**
    - Ensure the parent container has `w-full overflow-y-auto max-h-[calc(932px-140px)]` to make the rewards list scroll smoothly *inside* the phone border without stretching the frame or cutting off content.

- [ ] **Refactor Home / Search Page for Mobile Display Density:**

  The main map/routing query dashboard is expanding past the viewport boundaries. Refactor the layout to lock it cleanly inside our strict `max-w-[430px]` view container:

  1. **Routing Inputs Layout (Compact Density):**

     - Group the Origin and Destination search bars inside a tight, self-contained card: `bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mx-4 mt-3 space-y-2`.

     - Shrink input elements using `py-1.5 px-3 text-sm bg-slate-950 border-slate-800 rounded-xl focus:border-emerald-500`.

  2. **Transit Option Results (The Result Cards):**

     - Display route recommendation cards in a high-density vertical stack `flex flex-col gap-2 px-4 py-2`).

     - Force each transit result card (Bus, MRT, mixed) to use an ultra-compact layout: `p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col gap-2`.

     - Typography rule: Main route titles use `text-sm font-bold`, ETA/Travel duration uses `text-xs text-emerald-400`, and LTA loading/seating parameters use `text-[11px] text-slate-400`.

  3. **"START COMMUTE" Call-to-Action Integration:**

     - The "START COMMUTE" action button must span full width directly inside the recommended card wrapper: `w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-md mt-1`.

  4. **Map / Search Container Bounds:**

     - Restrict the scrolling layer of the search panel to prevent breaking the emulated device container: `w-full overflow-y-auto max-h-[calc(932px-220px)]`. Lock the horizontal container width with `max-w-full overflow-x-hidden`.