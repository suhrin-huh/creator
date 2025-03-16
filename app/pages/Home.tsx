"use client";

import { useState } from "react";
import WeeklyCalendar from "../components/WeeklyCalendar";
import TimeSelector from "../components/TimeSelector";
import dayjs from "dayjs";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  return (
    <>
      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <TimeSelector
        selectedDate={selectedDate}
        // onSelectDate={setSelectedDate}
      />
    </>
  );
};

export default Home;
