CRBridge: Web3 Compliance & Data Vault Interface

Note: This repository is a Technical Showcase. It demonstrates the architecture of a patent-pending compliance bridge connecting traditional data rights with blockchain transparency.

🚀 Project Overview

CRBridge solves the "Privacy Paradox" in Web3: How do you prove user consent on a public blockchain without exposing sensitive Personally Identifiable Information (PII)?

I architected a "Data Vault" Hybrid System that splits data into two streams:

Off-Chain (Private): Sensitive PII stored in a secure, encrypted PostgreSQL vault.

On-Chain (Public): Cryptographic proofs (hashes) and consent events recorded on the NEAR Protocol.

Role: Full Stack Engineer & Architect
Tech: Next.js, NEAR (Rust Contracts), Supabase, Arweave

🏗 Architecture: The "Vault" Pattern

The core innovation is the separation of concerns between Storage (Security) and Verification (Transparency).

sequenceDiagram
    participant User
    participant App as Next.js App
    participant Vault as Secure Vault (Supabase)
    participant Chain as NEAR Smart Contract
    
    User->>App: Signs Consent Form
    App->>App: Hashes Data (SHA-256)
    App->>Vault: Encrypts & Stores PII (Off-Chain)
    App->>Chain: Mints "Consent NFT" with Data Hash (On-Chain)
    Chain-->>App: Returns Transaction Hash
    App->>Vault: Updates Record with Proof


🧩 Key Technical Implementations

1. The "Consent Advisor" Agent

Problem: Smart contracts are unreadable to 99% of users.
Solution: Integrated an LLM-based agent that parses the raw Rust/WASM contract code and explains the implications to the user in plain English before they sign.

Stack: OpenAI API + LangChain + Custom System Prompts for Legal Translation.

2. Hybrid State Management

Problem: Blockchain data is slow to fetch; Database data is fast.
Solution: Built a Read-Through Cache using React Context and Redis.

The UI displays instantaneous data from the DB.

Background workers asynchronously verify the DB state against the Blockchain state to ensure integrity.

3. Secure PII Encryption

Implemented field-level encryption for data at rest. Even if the database is dumped, the PII remains unreadable without the specific decryption keys held in a separate KMS (Key Management System).

💻 Code Highlights: The Verification Logic

Demonstrating how we link off-chain records to on-chain proofs.

// /lib/verification.ts

import { connect, Contract } from 'near-api-js';
import { sha256 } from 'js-sha256';

export async function verifyConsentIntegrity(localRecord: ConsentRecord) {
  // 1. Re-hash the local sensitive data
  const calculatedHash = sha256(JSON.stringify(localRecord.pii));

  // 2. Fetch the immutable record from blockchain
  const near = await connect(nearConfig);
  const contract = await new Contract(near.connection, 'consent.near', {
    viewMethods: ['get_consent_hash'],
  });

  // 3. Compare
  const onChainHash = await contract.get_consent_hash({ userId: localRecord.id });

  return {
    isValid: calculatedHash === onChainHash,
    timestamp: new Date(),
    proof: onChainHash
  };
}


📬 Contact

Portfolio: github.com/mdelaguera

Email: michael.delaguera@gmail.com
