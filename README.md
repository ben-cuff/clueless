## Getting Started

The first thing you need to do to get started is to get a google GenAI api key and a judge0 API key. Both of these are available for free.

You can obtain a Judge0 API key from [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/).

You can get a Google GenAI API key from [Google AI Studio](https://aistudio.google.com/u/1/apikey/).

These can be used to fill in the API Key variables in .env.example

You will also need to generate a next-auth secret using the command

```bash
openssl rand -base64 32
```

Also, get a basic postgres database, I use a free one from [Vercel](https://vercel.com/)

You may need to run 

```bash
npm install
```

```bash
npx prisma migrate dev
```

Finally run
```bash
npm run dev
```
To run the development server
**[Project Plan](https://docs.google.com/document/d/1B2Hm8enXvcohJGuzSjPWdjvDlfEop8BRz_GVGimsBlg/edit?usp=sharing)**
