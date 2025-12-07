import { Skeleton } from "./ui/skeleton";

export const GitHubSkeleton = () => {
  return (
    <div className="github-content">
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "2px" }}>
            {Array.from({ length: 26 }).map((_, j) => (
              <Skeleton
                key={j}
                className="rounded-[3px]"
                style={{
                  width: "10px",
                  height: "10px",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};
