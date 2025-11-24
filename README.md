# Able to create collection bids while having insufficient funds
<img width="398" height="384" alt="image" src="https://github.com/user-attachments/assets/a4dbaef1-897f-4356-a7b0-b4354ddbd851" />


# Steps to Reproduce
This project is set up to run `bid.tsx` using TypeScript and Node.js.

## Prerequisites

- Node.js installed
- `npm` installed

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Edit `.env` and add your `API_KEY` (Bearer token) and `SENDER_PRIVATE_KEY` (Base58 encoded).

## Running the Script

You can run the script directly using `ts-node`:

```bash
npx ts-node bid.tsx
```

# Actual Result
The user is able to place a collection bid of 10,000,000 SOL, despite the wallet containing a very small amount (e.g. 0.09).

# Expected Result
The API should enforce the same balance validation as the UI, preventing users from placing offers that exceed their available wallet balance — especially extremely large bids (e.g., ~$100M).
