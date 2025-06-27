import { IMPORTS } from "@/constants/imports";

export async function POST(req: Request) {
  const { code, language, testcases } = await req.json();

  type LanguageValues = "java" | "javascript" | "cpp" | "python" | "csharp";

  const finalCode =
    language.value === "java"
      ? `${
          IMPORTS[language.value as LanguageValues]
        }${testcases}\n${code.trim()}`
      : `${
          IMPORTS[language.value as LanguageValues]
        }${code.trim()}\n${testcases}`;

  const encodedCode = btoa(finalCode);

  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY || "",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_code: encodedCode,
      language_id: language.id,
      stdin: "",
    }),
  };

  try {
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      options
    );
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to run code" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
