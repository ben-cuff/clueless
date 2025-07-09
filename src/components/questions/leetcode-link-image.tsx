import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function LeetcodeLinkImage({
  leetcodeURL,
}: {
  leetcodeURL: string;
}) {
  return (
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
          className="object-contain"
        />
      </Badge>
    </Link>
  );
}
