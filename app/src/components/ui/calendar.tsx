import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface CalendarContextType {
  selected: Date | undefined;
  setSelected: (date: Date | undefined) => void;
}

function Calendar({selected, setSelected}: CalendarContextType) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      className={`bg-white p-4`}
      
    />
  );
}

export default Calendar;