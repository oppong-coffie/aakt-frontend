import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong className="font-semibold text-current" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.92em] dark:bg-white/10"
          key={`${part}-${index}`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function isBulletLine(line: string): boolean {
  return /^[-*]\s+/.test(line.trim());
}

function isNumberedLine(line: string): boolean {
  return /^\d+\.\s+/.test(line.trim());
}

export default function AgentMessageContent({ content }: { content: string }) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const allBullets = lines.length > 0 && lines.every(isBulletLine);
        const allNumbered = lines.length > 0 && lines.every(isNumberedLine);

        if (allBullets) {
          return (
            <ul className="list-disc space-y-1 pl-5" key={`${blockIndex}-${block}`}>
              {lines.map((line, lineIndex) => (
                <li key={`${lineIndex}-${line}`}>{renderInline(line.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (allNumbered) {
          return (
            <ol className="list-decimal space-y-1 pl-5" key={`${blockIndex}-${block}`}>
              {lines.map((line, lineIndex) => (
                <li key={`${lineIndex}-${line}`}>{renderInline(line.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p className="whitespace-pre-wrap" key={`${blockIndex}-${block}`}>
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
