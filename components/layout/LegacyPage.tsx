import { legacyBody } from "@/lib/legacy-content";

export default function LegacyPage({ file }: { file: string }) {
  return <div dangerouslySetInnerHTML={{ __html: legacyBody(file) }} />;
}
