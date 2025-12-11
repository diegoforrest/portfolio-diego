import { useState, useEffect, useMemo, useCallback } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

const ContributionDay = ({ day, index }) => {
  // Map contribution count to heatmap level (0-8)
  const getHeatmapLevel = useCallback((count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count === 4) return 4;
    if (count === 5) return 5;
    if (count === 6) return 6;
    if (count === 7) return 7;
    return 8; // 8 or more contributions
  }, []);

  const formatDate = useCallback(
    (date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const heatmapLevel = getHeatmapLevel(day.count);

  if (!day.date) {
    return (
      <div
        key={index}
        style={{
          width: "var(--heatmap-box-size)",
          height: "var(--heatmap-box-size)",
          borderRadius: "3px",
          backgroundColor: "var(--heatmap-level-0)",
        }}
      />
    );
  }

  return (
    <Tooltip.Provider key={index}>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <div
            style={{
              width: "var(--heatmap-box-size)",
              height: "var(--heatmap-box-size)",
              borderRadius: "3px",
              backgroundColor: `var(--heatmap-level-${heatmapLevel})`,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="github-tooltip" sideOffset={5}>
            <div style={{ fontSize: "0.75rem", fontWeight: "600" }}>
              {formatDate(day.date)}
            </div>
            <div
              style={{ fontSize: "0.7rem", color: "var(--text-color-light)" }}
            >
              {day.count} contribution{day.count !== 1 ? "s" : ""}
            </div>
            <Tooltip.Arrow className="github-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const GitHubContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [streak, setStreak] = useState(0);

  const processedData = useMemo(() => {
    if (!contributions.length)
      return { rows: [], isEmpty: true, firstDate: null, lastDate: null };

    // Get the last 182 days (26 weeks) of contributions
    const recentDays = contributions.slice(-182);

    if (!recentDays.length)
      return { rows: [], isEmpty: true, firstDate: null, lastDate: null };

    // Create 7 rows (one for each day of the week)
    const rows = [[], [], [], [], [], [], []];

    const firstDayOfWeek = new Date(recentDays[0].date).getDay();

    // Add empty cells for days before the first contribution (to align the week)
    for (let i = 0; i < firstDayOfWeek; i++) {
      rows[i].push({ date: "", count: 0, level: 0 });
    }

    // Fill in the contributions
    recentDays.forEach((day) => {
      const dayOfWeek = new Date(day.date).getDay();
      rows[dayOfWeek].push(day);
    });

    // Pad rows to have equal length (fill remaining days of current week)
    const maxLength = Math.max(...rows.map((row) => row.length));
    rows.forEach((row) => {
      while (row.length < maxLength) {
        row.push({ date: "", count: 0, level: 0 });
      }
    });

    // First date is the first actual contribution
    const firstDate = recentDays[0]?.date || null;
    // Last date is the last actual contribution
    const lastDate = recentDays[recentDays.length - 1]?.date || null;

    return { rows, isEmpty: false, firstDate, lastDate };
  }, [contributions]);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHubContributions = async () => {
      if (cancelled) return;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/diegoforrest?y=last`,
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Failed to fetch GitHub contributions");

        const data = await res.json();
        if (!data?.contributions || !Array.isArray(data.contributions)) {
          throw new Error("Invalid API format");
        }

        if (cancelled) return;

        const allDays = data.contributions;
        const total = data.total?.lastYear || 0;

        // Get all available days - processedData will handle the 182 day slice
        const days = allDays;

        let streakCount = 0,
          currentStreak = 0;
        const processed = days.map((day) => {
          const count = parseInt(day.count) || 0;
          const level = Math.min(Math.max(0, day.level), 4);
          if (count > 0) {
            currentStreak++;
            streakCount = Math.max(streakCount, currentStreak);
          } else {
            currentStreak = 0;
          }

          return { date: day.date, count, level };
        });

        setContributions(processed);
        setTotalContributions(total);
        setStreak(streakCount);
      } catch (err) {
        if (cancelled) return;
        console.error("GitHub API error:", err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchGitHubContributions, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const renderGrid = useCallback(() => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--heatmap-gap)",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--heatmap-gap)" }}>
              {Array.from({ length: 26 }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    width: "var(--heatmap-box-size)",
                    height: "var(--heatmap-box-size)",
                    borderRadius: "3px",
                    backgroundColor: "var(--heatmap-level-0)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (processedData.isEmpty) {
      return (
        <div
          style={{
            color: "var(--text-color-light)",
            fontSize: "0.875rem",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No contribution data available
        </div>
      );
    }

    return (
      <div style={{ width: "100%", overflowX: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--heatmap-gap)",
            minWidth: "max-content",
          }}
        >
          {processedData.rows.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--heatmap-gap)" }}>
              {row.map((day, j) => (
                <ContributionDay
                  key={`${i}-${j}`}
                  day={day}
                  index={`${i}-${j}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }, [isLoading, processedData]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, marginBottom: "12px" }}>{renderGrid()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--text-color-light)",
        }}
      >
        <span>
          {processedData.firstDate
            ? new Date(processedData.firstDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </span>
        <span>
          {processedData.lastDate
            ? new Date(processedData.lastDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </span>
      </div>
    </div>
  );
};
