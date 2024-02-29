import Navigation from "../components/Navigation";
import Add from "../components/Add";
import useTracker from "../hooks/useTracker";

export default function Entry() {
  const { entries, total, sumEntry, getEntries } = useTracker(0);

  //TODO: FIX ADD BUTTON TO RE-RENDER

  console.log("entries:", entries);

  return (
    <>
      <h1>Journal</h1>
      <Navigation />
      {/* <div style={{ marginBottom: "50px" }}>
        <Add sumEntry={sumEntry} getEntries={getEntries} />
      </div> */}
      <h2>Total: {total}</h2>
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
