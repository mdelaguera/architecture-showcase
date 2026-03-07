# CompliantIR: Automated Investor Relations Platform

> **Note:** This repository showcases the architecture of CompliantIR, a platform automating the ingestion and visualization of SEC financial data for public companies.

## 🚀 Project Overview

Investor Relations (IR) teams spend hours manually updating websites with new SEC filings. CompliantIR automates this entirely. It listens for new EDGAR filings, parses the XBRL (eXtensible Business Reporting Language) data, and instantly deploys updated financial dashboards.

- **Role:** Founder & Lead Developer
- **Tech:** Next.js (App Router), Vercel Serverless, MDX, SEC EDGAR API

## 🛠 Tech Stack & Features

- **Data Pipeline:** Custom Node.js scripts to poll and parse SEC RSS feeds.
- **Content Layer:** Uses contentlayer to treat MDX files as a database for press releases, ensuring fast Static Site Generation (SSG).
- **Serverless Infrastructure:** Entire backend runs on Vercel Edge Functions for zero-maintenance scaling.

## 🧩 Architectural Highlights

### 1. Automated SEC Ingestion

The system polls the SEC EDGAR database. When a new filing (8-K, 10-Q) is detected:

1. **Parse:** The system extracts the XBRL tags (Revenue, Net Income).
2. **Transform:** Data is normalized into JSON for the frontend.
3. **Deploy:** A webhook triggers a Vercel rebuild to update the static pages immediately.

### 2. High-Performance Static Rendering

Because IR sites experience massive traffic spikes during earnings calls, I utilized Incremental Static Regeneration (ISR).

- Pages are static (fast, cacheable via CDN).
- They update automatically when new data arrives, without a full site rebuild.

## 💻 Code Snippet: SEC Data Fetcher

A simplified look at how we handle external API reliability.

```ts
// /lib/services/sec-edgar.ts

export async function fetchLatestFilings(ticker: string) {
  try {
    const response = await fetch(
      `https://data.sec.gov/submissions/CIK${cikMapping[ticker]}.json`,
      {
        headers: { 'User-Agent': 'CompliantIR Contact@compliantir.com' },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) throw new Error('SEC API Unreachable');

    const data = await response.json();
    return transformFilings(data.filings.recent);

  } catch (error) {
    console.error('Fallback to cached data:', error);
    return getCachedFilings(ticker); // Reliability fallback
  }
}
```

## 📬 Contact

- **Portfolio:** [github.com/mdelaguera](https://github.com/mdelaguera)
- **Email:** michael.delaguera@gmail.com