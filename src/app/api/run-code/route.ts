import { judge0_api_url } from '@/constants/api-urls';
import { IMPORTS } from '@/constants/imports';
import { LanguageValues } from '@/constants/language-options';
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api/api-responses';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { code, language, testcases } = await body;

  if (!code || !language) {
    return get400Response('Missing required fields: code, language');
  }

  // java needs testcases to be at the top of the code
  const finalCode =
    language.value === 'java'
      ? `${
          IMPORTS[language.value as LanguageValues]
        }${testcases}\n${code.trim()}`
      : `${
          IMPORTS[language.value as LanguageValues]
        }${code.trim()}\n${testcases}`;

  const encodedCode = btoa(finalCode);

  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY ?? '',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_code: encodedCode,
      language_id: language.id,
      stdin: '',
    }),
  };

  try {
    const response = await fetch(judge0_api_url, options);
    const result = await response.json();
    return get200Response(result);
  } catch {
    return UnknownServerError;
  }
}
