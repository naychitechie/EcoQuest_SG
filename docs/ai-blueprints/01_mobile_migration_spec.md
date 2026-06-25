We are migrating our current web app into a mobile-first web experience. Do not delete or break our existing LTA Datamall and OneMap API routing logic. Instead, modify the codebase according to these exact instructions:

1. MOBILE WEB WRAPPER: 
Wrap our entire application layout inside a fixed-width, mobile-emulated viewport container centered on the screen. Use this Tailwind class structure for the main outer wrapper: 
"max-w-[430px] min-h-[932px] mx-auto border-[8px] border-slate-800 rounded-[60px] shadow-2xl overflow-hidden bg-[#121824] text-white font-sans"

2. ECOQUEST SG DASHBOARD HEADER:
At the top of the mobile view, inject a premium user profile card for "Alex Tan" featuring a "4-Day Streak" flame badge, a total progress metric of "72%", and three active tracker rows:
- Transport: "TRANSPORT: AMK MRT Sprint Verified! (100%)" (Green check style)
- Food: "FOOD: Personalized Local Nudge: 'Try a plant-based acai bowl outside Raffles Place MRT.' (In Progress: 45%)" (Fork/knife icon style)
- Energy: "ENERGY: AC Sleep Timer: 'Run AC for 2 hours instead of 4.' (Adaptive Logic: Difficulty Reduced)" (Blue lightning/home style)

3. INTEGRATE THE "START COMMUTE" LOCK LOGIC:
Find our existing route result cards (where MRT/Bus results are displayed). Inject a prominent green button labeled "START COMMUTE" directly onto the recommended public transit card. 

4. TRANSACTIONAL SIMULATION STATES (FOR PRESENTATION):
Set up a client-side state machine using localStorage:
- Clicking "START COMMUTE" transitions the component into an active "Transit Lock" layout overlay reading: "COMMUTE IN PROGRESS: Arriving at Raffles Place Stn in 18 minutes. Verifying Schedule..." and disables early rewards.
- Add a tiny, discreet button labeled "[DEBUG: FAST FORWARD]". Clicking this instantly transitions the app to an "End State" celebratory modal: "🎉 COMMUTE COMPLETE! Reward Verified! +50 Streak Coins Earned | 1.2kg CO2 Saved", with a final action button to "CLAIM REWARDS & POST".

Please refactor our existing layout to seamlessly weave these elements in. Keep our dynamic API search functional underneath.