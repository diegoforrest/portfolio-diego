import { Skeleton } from "./ui/skeleton";

export const AboutSkeleton = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-header">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>

        <div className="bento-grid">
          {/* Profile card skeleton */}
          <div className="bento-card profile-card">
            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>

          {/* Intro card skeleton */}
          <div className="bento-card intro-card">
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Education card skeleton */}
          <div className="bento-card education-card">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>

          {/* Tech stack skeleton */}
          <div className="bento-card tech-stack-card">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Beyond the code skeleton */}
          <div className="bento-card beyond-card">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Films skeleton */}
          <div className="bento-card films-card">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 rounded-lg mb-3" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Games skeleton */}
          <div className="bento-card games-card">
            <Skeleton className="h-48 rounded-lg" />
          </div>

          {/* Music skeleton */}
          <div className="bento-card music-card">
            <Skeleton className="h-56 rounded-lg" />
          </div>

          {/* GitHub skeleton */}
          <div className="bento-card github-card">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-0.5">
                  {Array.from({ length: 26 }).map((_, j) => (
                    <Skeleton key={j} className="w-2.5 h-2.5 rounded-[3px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
