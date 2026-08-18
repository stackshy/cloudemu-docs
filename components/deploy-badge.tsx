// Deploy-to-ZopDay campaign badge. The SVG is self-theming — it carries its own
// light/dark background via prefers-color-scheme — so it stays legible on both
// themes without a light/dark variant swap.
export function DeployBadge() {
  return (
    <a
      href="https://zop.dev/zopday/app"
      target="_blank"
      rel="noreferrer"
      aria-label="Deploy your own cloudemu on ZopCloud with ZopDay"
      className="inline-flex items-center transition-opacity hover:opacity-90"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/deploy-to-zop.svg"
        alt="Deploy to ZopDay"
        width={169}
        height={36}
        className="h-7 w-auto"
      />
    </a>
  );
}
