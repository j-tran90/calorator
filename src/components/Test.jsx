import Navigation from "./Navigation";
import useTracker from "../hooks/useTracker";
import { useState } from "react";

export default function Test() {
  const { entries, total } = useTracker();

  return (
    <>
      <Navigation />
      <h2> Total: {total}</h2>
      {entries.map((entry) => {
        return (
          <div key={entry.id}>
            {JSON.stringify(
              entry.createdAt.toDate().toLocaleTimeString(navigator.language, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            ).replace(/['"]+/g, "")}
            : {entry.calories}
          </div>
        );
      })}
    </>
  );
}
