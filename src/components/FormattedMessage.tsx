"use client";

import React from "react";

interface FormattedMessageProps {
  content: string;
}

export function FormattedMessage({ content }: FormattedMessageProps) {
  // Parse and format the message content
  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: "bullet" | "numbered" | null = null;
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          listType === "numbered" ? (
            <ol
              key={`list-${key++}`}
              className="list-decimal list-inside space-y-1.5 my-3 pl-4"
            >
              {currentList.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ol>
          ) : (
            <ul
              key={`list-${key++}`}
              className="list-disc list-inside space-y-1.5 my-3 pl-4"
            >
              {currentList.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ul>
          )
        );
        currentList = [];
        listType = null;
      }
    };

    const parseInlineFormatting = (line: string) => {
      const parts: (string | JSX.Element)[] = [];
      let currentText = "";
      let i = 0;
      let inlineKey = 0;

      while (i < line.length) {
        // Bold text: **text** or __text__
        if (
          (line[i] === "*" && line[i + 1] === "*") ||
          (line[i] === "_" && line[i + 1] === "_")
        ) {
          if (currentText) {
            parts.push(currentText);
            currentText = "";
          }

          const delimiter = line.slice(i, i + 2);
          const endIndex = line.indexOf(delimiter, i + 2);

          if (endIndex !== -1) {
            const boldText = line.slice(i + 2, endIndex);
            parts.push(
              <strong key={`bold-${inlineKey++}`} className="font-semibold">
                {boldText}
              </strong>
            );
            i = endIndex + 2;
            continue;
          }
        }

        // Italic text: *text* or _text_
        if (line[i] === "*" || line[i] === "_") {
          if (currentText) {
            parts.push(currentText);
            currentText = "";
          }

          const delimiter = line[i];
          const endIndex = line.indexOf(delimiter, i + 1);

          if (endIndex !== -1 && endIndex !== i + 1) {
            const italicText = line.slice(i + 1, endIndex);
            parts.push(
              <em key={`italic-${inlineKey++}`} className="italic">
                {italicText}
              </em>
            );
            i = endIndex + 1;
            continue;
          }
        }

        // Code: `text`
        if (line[i] === "`") {
          if (currentText) {
            parts.push(currentText);
            currentText = "";
          }

          const endIndex = line.indexOf("`", i + 1);

          if (endIndex !== -1) {
            const codeText = line.slice(i + 1, endIndex);
            parts.push(
              <code
                key={`code-${inlineKey++}`}
                className="px-1.5 py-0.5 rounded bg-muted/60 text-xs font-mono"
              >
                {codeText}
              </code>
            );
            i = endIndex + 1;
            continue;
          }
        }

        currentText += line[i];
        i++;
      }

      if (currentText) {
        parts.push(currentText);
      }

      return parts.length > 0 ? parts : line;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Empty line - flush list and add spacing
      if (!trimmedLine) {
        flushList();
        if (elements.length > 0 && index < lines.length - 1) {
          elements.push(<div key={`space-${key++}`} className="h-3" />);
        }
        return;
      }

      // Numbered list: 1. item
      if (/^\d+\.\s/.test(trimmedLine)) {
        const content = trimmedLine.replace(/^\d+\.\s/, "");
        if (listType !== "numbered") {
          flushList();
          listType = "numbered";
        }
        currentList.push(content);
        return;
      }

      // Bullet list: * item or - item or • item
      if (/^[\*\-•]\s/.test(trimmedLine)) {
        const content = trimmedLine.replace(/^[\*\-•]\s/, "");
        if (listType !== "bullet") {
          flushList();
          listType = "bullet";
        }
        currentList.push(content);
        return;
      }

      // Heading: ## Heading or **Heading:**
      if (trimmedLine.startsWith("##")) {
        flushList();
        const headingText = trimmedLine.replace(/^##\s*/, "");
        elements.push(
          <h3
            key={`heading-${key++}`}
            className="font-semibold text-base mt-4 mb-2"
          >
            {parseInlineFormatting(headingText)}
          </h3>
        );
        return;
      }

      // Bold heading pattern: **Text:**
      if (/^\*\*[^:]+:\*\*/.test(trimmedLine)) {
        flushList();
        elements.push(
          <p key={`para-${key++}`} className="text-sm leading-relaxed my-2">
            {parseInlineFormatting(trimmedLine)}
          </p>
        );
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`para-${key++}`} className="text-sm leading-relaxed my-1.5">
          {parseInlineFormatting(trimmedLine)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return <div className="space-y-1">{formatContent(content)}</div>;
}
