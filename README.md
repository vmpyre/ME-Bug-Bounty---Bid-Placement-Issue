# Able to create collection bids while having insufficient funds
<img width="398" height="384" alt="image" src="https://github.com/user-attachments/assets/a4dbaef1-897f-4356-a7b0-b4354ddbd851" />


# How to Build and Run `bid.tsx`
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

## Building (Optional)

If you want to compile the TypeScript code to JavaScript:

1.  **Build**:
    ```bash
    npx tsc
    ```
    This will create a `dist` directory with the compiled JavaScript.

2.  **Run Compiled Code**:
    ```bash
    node dist/bid.js
    ```
