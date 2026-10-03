"use client";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  index?: string;
}

export default function SectionLabel({
  children,
  className = "",
  index,
}: SectionLabelProps) {
  return (
    <div className={`section-label ${className}`}>
      {index && (
        <span style={{ color: "var(--fg-subtle)", marginRight: "0.5rem" }}>
          [{index}]
        </span>
      )}
      {children}
    </div>
  );
}
