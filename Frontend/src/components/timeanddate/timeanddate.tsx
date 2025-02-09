import { useState, useEffect } from "react";
import { Calendar, Clock1, X } from "lucide-react";

const TimeAndDate: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [todayDate, setTodayDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let amPm = "";

      if (hours >= 12) {
        hours = hours - 12;
        amPm = "PM";
      } else if (hours === 0) {
        hours = 12;
        amPm = "AM";
      } else {
        amPm = "AM";
      }

      let years = time.getFullYear();
      let months = time.getMonth() + 1;
      let days = time.getDate();
      const formattedHours = hours > 9 ? hours : "0" + hours;
      const formattedMinutes = minutes > 9 ? minutes : "0" + minutes;

      const timeString = `${formattedHours}:${formattedMinutes} ${amPm}`;
      const dateString = `${months}/${days}/${years}`;

      setCurrentTime(`${timeString}`);
      setTodayDate(`${dateString}`);
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
