import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type University = {
  id: string;
  name: string;
  shortName?: string;
  acronym?: string;
  city?: string;
  region?: string;
  website?: string;
  logo?: string;
};

type HealthResponse = {
  status: string;
  application?: string;
  country?: string;
  currency?: string;
  universities?: number;
  gemini?: string;
};

type UniversitiesResponse = {
  status: string;
  universities: University[];
};

function CampusConnectApp() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCampusData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [healthResponse, universitiesResponse] = await Promise.all([
        fetch("/api/health", { headers: { Accept: "application/json" } }),
        fetch("/api/universities", { headers: { Accept: "application/json" } }),
      ]);

      if (!healthResponse.ok || !universitiesResponse.ok) {
        throw new Error("CampusConnect services are temporarily unavailable.");
      }

      const [healthData, universityData] = await Promise.all([
        healthResponse.json() as Promise<HealthResponse>,
        universitiesResponse.json() as Promise<UniversitiesResponse>,
      ]);

      if (!Array.isArray(universityData.universities)) {
        throw new Error("The university directory returned an unexpected response.");
      }

      setHealth(healthData);
      setUniversities(universityData.universities);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load CampusConnect data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampusData();
  }, [loadCampusData]);

  const filteredUniversities = universities.filter((university) => {
    const searchText = [
      university.name,
      university.shortName,
      university.acronym,
      university.city,
      university.region,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(query.trim().toLowerCase());
  });

  return (
    <>
      <style>{`
        :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f7fb; color: #172033; }
        * { box-sizing: border-box; }
        body { margin: 0; min-width: 320px; }
        button, input { font: inherit; }
        .app-shell { min-height: 100vh; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px clamp(20px, 6vw, 84px); background: #111b35; color: white; }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; letter-spacing: -.03em; }
        .brand-mark { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; background: linear-gradient(135deg, #31b6a5, #3975e8); font-size: 21px; }
        .brand small { display: block; margin-top: 2px; color: #aab7d1; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; }
        .status { display: inline-flex; align-items: center; gap: 8px; color: #d6e4ff; font-size: 13px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #38d39f; box-shadow: 0 0 0 4px #38d39f22; }
        .hero { padding: 68px clamp(20px, 8vw, 110px) 58px; background: radial-gradient(circle at 82% 12%, #315da5 0, transparent 32%), linear-gradient(125deg, #14213f, #203c6b 65%, #1d5b72); color: white; }
        .eyebrow { color: #85e2d2; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h1 { max-width: 760px; margin: 16px 0; font-size: clamp(36px, 6vw, 64px); line-height: 1.04; letter-spacing: -.055em; }
        .hero p { max-width: 650px; margin: 0; color: #d6e2f7; font-size: 17px; line-height: 1.7; }
        .content { width: min(1120px, calc(100% - 40px)); margin: -24px auto 0; padding-bottom: 64px; }
        .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .stat, .panel, .university-card { border: 1px solid #e5eaf2; border-radius: 18px; background: white; box-shadow: 0 12px 36px #18294a0a; }
        .stat { padding: 20px; }
        .stat strong { display: block; color: #182747; font-size: 25px; letter-spacing: -.04em; }
        .stat span { display: block; margin-top: 5px; color: #72809a; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .panel { margin-top: 26px; padding: 26px; }
        .section-heading { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
        h2 { margin: 0; color: #192847; font-size: 24px; letter-spacing: -.04em; }
        .muted { margin: 6px 0 0; color: #78859b; font-size: 14px; }
        .search { width: min(100%, 320px); padding: 12px 14px; border: 1px solid #dce3ee; border-radius: 11px; outline: none; color: #1b2943; background: #fbfcfe; }
        .search:focus { border-color: #3975e8; box-shadow: 0 0 0 3px #3975e822; }
        .university-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .university-card { padding: 18px; box-shadow: none; transition: transform .18s ease, border-color .18s ease; }
        .university-card:hover { transform: translateY(-2px); border-color: #b9c9e6; }
        .uni-top { display: flex; align-items: center; gap: 12px; }
        .uni-icon { display: grid; width: 42px; height: 42px; flex: 0 0 42px; place-items: center; border-radius: 13px; background: #edf3ff; font-size: 21px; }
        .university-card h3 { margin: 0; color: #1a2946; font-size: 15px; line-height: 1.35; }
        .university-card p { margin: 12px 0 0; color: #78859b; font-size: 13px; }
        .uni-code { display: inline-block; margin-top: 13px; padding: 5px 9px; border-radius: 7px; background: #eff8f6; color: #167d70; font-size: 11px; font-weight: 800; letter-spacing: .06em; }
        .notice { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 16px; border-radius: 12px; background: #fff7e8; color: #80571a; font-size: 14px; }
        .retry { border: 0; border-radius: 9px; padding: 10px 14px; background: #1c3767; color: white; cursor: pointer; font-weight: 700; }
        .empty { padding: 34px 16px; text-align: center; color: #78859b; }
        footer { padding: 24px; color: #8994a8; text-align: center; font-size: 12px; }
        @media (max-width: 760px) { .university-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .hero { padding-top: 52px; } }
        @media (max-width: 520px) { .topbar { align-items: flex-start; } .status { font-size: 11px; } .stats { grid-template-columns: 1fr; } .stat { padding: 15px; } .university-grid { grid-template-columns: 1fr; } .panel { padding: 18px; } .section-heading { align-items: stretch; } .search { width: 100%; } }
      `}</style>

      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">🎓</span>
            <span>CampusConnect<small>Tanzania · Student ecosystem</small></span>
          </div>
          <div className="status">
            <span className="status-dot" />
            {health?.status === "ok" ? "Services operational" : "Connecting to services"}
          </div>
        </header>

        <section className="hero">
          <div className="eyebrow">Built for students across Tanzania</div>
          <h1>Your campus life, connected.</h1>
          <p>
            Discover universities and connect with the opportunities, people,
            and services that make student life easier.
          </p>
        </section>

        <main className="content">
          <section className="stats" aria-label="Platform status">
            <div className="stat">
              <strong>{loading ? "…" : universities.length}</strong>
              <span>Universities listed</span>
            </div>
            <div className="stat">
              <strong>{health?.currency ?? "TZS"}</strong>
              <span>Local currency</span>
            </div>
            <div className="stat">
              <strong>{health?.gemini === "enabled" ? "AI ready" : health ? "Available" : "…"}</strong>
              <span>Student companion</span>
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Explore universities</h2>
                <p className="muted">Find your institution by name, acronym, or city.</p>
              </div>
              <input
                className="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search universities…"
                aria-label="Search universities"
              />
            </div>

            {error && (
              <div className="notice" role="alert">
                <span>{error}</span>
                <button className="retry" onClick={() => void loadCampusData()}>Try again</button>
              </div>
            )}

            {loading ? (
              <div className="empty" role="status">Loading university directory…</div>
            ) : error && universities.length === 0 ? (
              <div className="empty">The directory could not be loaded. Please retry.</div>
            ) : filteredUniversities.length === 0 ? (
              <div className="empty">No universities match “{query}”. Try another search.</div>
            ) : (
              <div className="university-grid">
                {filteredUniversities.map((university) => (
                  <article className="university-card" key={university.id}>
                    <div className="uni-top">
                      <span className="uni-icon" aria-hidden="true">{university.logo || "🎓"}</span>
                      <h3>{university.name}</h3>
                    </div>
                    <p>{[university.city, university.region].filter(Boolean).join(" · ") || "Tanzania"}</p>
                    {university.acronym && <span className="uni-code">{university.acronym}</span>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer>CampusConnect Tanzania · Connecting student communities</footer>
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('CampusConnect could not find the "#root" mount element.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <CampusConnectApp />
  </React.StrictMode>,
);
