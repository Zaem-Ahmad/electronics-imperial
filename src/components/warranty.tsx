import { Icon } from "./icon";

export function Warranty({ description }: { description: string }) {
  const blocks = description.split("\n\n");
  return (
    <section
      id="warranty"
      className="warranty-section section"
      aria-labelledby="warranty-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">PEACE OF MIND, INCLUDED</p>
          <h2 id="warranty-heading">A little reassurance goes a long way.</h2>
        </div>
        <Icon name="shield" width="48" height="48" />
      </div>
      <div className="warranty-content">
        {blocks.map((block, index) => {
          if (index === 0)
            return (
              <h3 key={index} className="warranty-title">
                {block}
              </h3>
            );
          if (block.endsWith(":")) return <h4 key={index}>{block}</h4>;
          return (
            <div key={index} className="warranty-paragraphs">
              {block.split("\n").map((line, lineIndex) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
