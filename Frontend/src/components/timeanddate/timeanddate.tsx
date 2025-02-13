import { useState, useEffect } from "react";
import { Calendar, Clock1 } from "lucide-react";

const TimeAndDate: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [todayDate, setTodayDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      let hours = time.getHours();
      const minutes = time.getMinutes();
      let amPm = "";

      if (hours >= 12) {
        amPm = "PM";
      } else {
        amPm = "AM";
      }

      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours = hours - 12;
      }

      const years = time.getFullYear();
      const months = time.getMonth() + 1;
      const days = time.getDate();

      const formattedHours = hours > 9 ? hours : "0" + hours;
      const formattedMinutes = minutes > 9 ? minutes : "0" + minutes;

      const timeString = `${formattedHours}:${formattedMinutes} ${amPm}`;
      const dateString = `${months > 9 ? months : "0" + months}/${
        days > 9 ? days : "0" + days
      }/${years}`;

      setCurrentTime(timeString);
      setTodayDate(dateString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="hidden md:flex md:gap-4 md:items-center">
        <span className="flex gap-2">
          <Clock1 className="size-5" />
          {currentTime}
        </span>
        <span className="flex gap-2">
          <Calendar className="size-5" /> {todayDate}
        </span>
      </div>
    </>
  );
};

export default TimeAndDate;
