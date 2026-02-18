/**
 * Streaming loading skeleton for the totem page.
 * Displayed by Next.js while the async Server Component fetches data.
 * Uses the default brand colours since theme_config is not yet loaded.
 */
export default function TotemLoading() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
      }}
    >
      {/* Header skeleton */}
      <div
        className="w-full py-10 flex flex-col items-center gap-4 animate-pulse"
        style={{
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
        }}
      >
        <div className="w-24 h-24 rounded-full bg-white/30" />
        <div className="h-8 w-48 rounded-full bg-white/30" />
        <div className="h-4 w-32 rounded-full bg-white/20" />
      </div>

      {/* Nav bar skeleton */}
      <div className="flex gap-3 justify-center py-6 px-4 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 rounded-full animate-pulse"
            style={{ background: "rgba(255,105,180,0.2)" }}
          />
        ))}
      </div>

      {/* Sections skeleton */}
      <div className="max-w-7xl mx-auto px-4 pb-16 space-y-16">
        {[...Array(2)].map((_, sIdx) => (
          <div key={sIdx} className="animate-pulse">
            {/* Section title */}
            <div
              className="h-16 rounded-3xl mb-8"
              style={{ background: "rgba(255,105,180,0.25)" }}
            />
            {/* Product grid */}
            <div className="product-grid">
              {[...Array(3)].map((_, iIdx) => (
                <div
                  key={iIdx}
                  className="rounded-[20px] p-8 flex flex-col items-center gap-4 border-2"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderColor: "#FFB6C1",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{ background: "rgba(255,105,180,0.15)" }}
                  />
                  <div
                    className="h-5 w-28 rounded-full"
                    style={{ background: "rgba(255,105,180,0.15)" }}
                  />
                  <div
                    className="h-4 w-36 rounded-full"
                    style={{ background: "rgba(255,105,180,0.1)" }}
                  />
                  <div
                    className="h-3 w-24 rounded-full"
                    style={{ background: "rgba(255,105,180,0.1)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
