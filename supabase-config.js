// ============================================================
// SUPABASE CONFIG
// ============================================================
// Get these from your Supabase project:
//   Dashboard → Project Settings → API
//
//   • Project URL    → SUPABASE_URL
//   • anon public    → SUPABASE_ANON_KEY  (this key is safe in
//                                          frontend code; RLS
//                                          policies in setup.sql
//                                          enforce security)
// ============================================================

const SUPABASE_URL      = "https://ivzgvpoxeooiaiyqghal.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2emd2cG94ZW9vaWFpeXFnaGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDE5MzEsImV4cCI6MjA5MzQ3NzkzMX0.oYoXDQgTpR_n9tscNrfqAJMKzoj-aIInrmRhVk6M3sw";

(function () {
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("[supabase-config] Supabase JS not loaded. Check the <script> tag order.");
    return;
  }

  const looksUnconfigured =
    SUPABASE_URL.includes("YOUR-PROJECT") ||
    SUPABASE_ANON_KEY.includes("YOUR-ANON");

  if (looksUnconfigured) {
    console.warn(
      "[supabase-config] Using placeholder credentials. " +
      "The form will not save. Edit supabase-config.js with your project values."
    );
  }

  window.sinnaDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.sinnaDbConfigured = !looksUnconfigured;
})();
