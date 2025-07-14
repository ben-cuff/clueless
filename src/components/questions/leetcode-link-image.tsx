import Image from "next/image";
import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../error-fallback";
import { Badge } from "../ui/badge";

export default function LeetcodeLinkImage({
  leetcodeURL,
}: {
  leetcodeURL: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while rendering leetcode link, try again later" />
      }
    >
      <Link
        href={leetcodeURL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
      >
        <Badge className="rounded-full p-1">
          <Image
            alt="leetcode-logo"
            src={"/leet_code_logo_black.png"}
            width={40}
            height={40}
            className="object-contain min-w-8"
          />
        </Badge>
      </Link>
    </ErrorBoundary>
  );
}
