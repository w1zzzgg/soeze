// =============================================================================
// VISITOR COUNTER SERVICE — SOEZE.TECH
// =============================================================================
// Decoupled architecture for website visitor tracking.
// Replace placeholder logic with your production analytics provider (e.g. Supabase,
// Vercel Analytics, Cloudflare KV, or Custom API).
// =============================================================================

export interface VisitorAnalyticsProvider {
  name: string;
  getVisits(): Promise<number>;
  recordVisit(): Promise<number>;
}

// REPLACE_ME: Connect your preferred database or analytics provider here
// Supported providers can easily implement the VisitorAnalyticsProvider interface.
export const ANALYTICS_CONFIG = {
  provider: "placeholder" as "placeholder" | "supabase" | "vercel" | "custom",
  // REPLACE_ME: Set base count offset or initial count
  baselineCount: 1284,
  // REPLACE_ME — CONNECT VISITOR ANALYTICS: Set real API endpoint or credentials
  endpoint: "[REPLACE_ME — CONNECT VISITOR ANALYTICS]",
};

const SESSION_KEY = "soeze_session_visited_v1";

class PlaceholderVisitorService implements VisitorAnalyticsProvider {
  name = "placeholder";

  async getVisits(): Promise<number> {
    if (typeof window === "undefined") {
      return ANALYTICS_CONFIG.baselineCount;
    }
    const stored = localStorage.getItem("soeze_dev_visits");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return ANALYTICS_CONFIG.baselineCount;
  }

  async recordVisit(): Promise<number> {
    if (typeof window === "undefined") {
      return ANALYTICS_CONFIG.baselineCount;
    }

    // Protect against double-counting across StrictMode, hydration, and route changes
    const alreadyCountedInSession = sessionStorage.getItem(SESSION_KEY);
    const current = await this.getVisits();

    if (alreadyCountedInSession) {
      return current;
    }

    const next = current + 1;
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
      localStorage.setItem("soeze_dev_visits", next.toString());
    } catch {
      // Ignore storage restrictions if in private browsing
    }
    return next;
  }
}

const activeService: VisitorAnalyticsProvider = new PlaceholderVisitorService();

export async function getVisitCount(): Promise<number> {
  try {
    return await activeService.getVisits();
  } catch (err) {
    console.warn("[visitor-counter] Failed to fetch visit count, using baseline", err);
    return ANALYTICS_CONFIG.baselineCount;
  }
}

export async function incrementVisitCount(): Promise<number> {
  try {
    return await activeService.recordVisit();
  } catch (err) {
    console.warn("[visitor-counter] Failed to increment visit count", err);
    return ANALYTICS_CONFIG.baselineCount;
  }
}
