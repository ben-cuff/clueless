## Deployed site URL

[Deployed Link](https://clueless-nu.vercel.app/)

## Getting Started

### Quick Start
For a quick start, I've included throwaway keys and databases in `.env.example`. You can simply rename this file to `.env` and get started immediately without setting up your own keys.

### Setting Up Your Own Environment
If you prefer to use your own keys and databases:

1. **API Keys**:
    - Get a Google GenAI API key from [Google AI Studio](https://aistudio.google.com/u/1/apikey/)
    - Obtain a Judge0 API key from [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/)

2. **Next-Auth Secret**:
    - Generate a secret using:
      ```bash
      openssl rand -base64 32
      ```

3. **Database Setup**:
    - Set up a basic Postgres database (a free one from [Vercel](https://vercel.com/) works well)
    - Set up a Redis server for caching (use [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/) or run locally)

4. **Environment Configuration**:
    - Add all values to your `.env` file (use `.env.example` as a template)

5. **Project Setup**:
    - Install dependencies:
      ```bash
      npm install
      ```
    - Run database migrations:
      ```bash
      npx prisma migrate dev
      ```
    - Start the development server:
      ```bash
      npm run dev
      ```

**[Project Plan](https://docs.google.com/document/d/1B2Hm8enXvcohJGuzSjPWdjvDlfEop8BRz_GVGimsBlg/edit?usp=sharing)**
