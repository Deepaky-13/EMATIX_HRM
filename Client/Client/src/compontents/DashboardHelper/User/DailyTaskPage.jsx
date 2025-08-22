import React, { useState } from "react";
import Dailytask from "./DailyTaskComponenyt";
import NotUpdated from "./NotUpdatedTask";

const DailyTaskPage = () => {
  const [view, setView] = useState("daily"); // 'daily' or 'notUpdated'

  return (
    <div className="p-4 space-y-4">
      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setView("daily")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Show Daily Task
        </button>
        <button
          onClick={() => setView("notUpdated")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Show Not Updated
        </button>
      </div>

      {/* Conditionally Render Components */}
      {view === "daily" && <Dailytask />}
      {view === "notUpdated" && <NotUpdated />}
    </div>
  );
};

export default DailyTaskPage;
