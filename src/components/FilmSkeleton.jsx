import { Skeleton } from "./ui/skeleton";

export const FilmSkeleton = ({ index }) => {
  const rotations = [-15, 0, 12];
  const scales = [0.9, 1, 0.9];

  return (
    <div
      className={`film-card film-${index}`}
      style={{
        position: "absolute",
        transform: `rotate(${rotations[index]}deg) scale(${scales[index]})`,
      }}
    >
      <Skeleton className="w-full h-full rounded-[12px]" />
    </div>
  );
};
