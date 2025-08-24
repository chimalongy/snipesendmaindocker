// globalfunctions.js or getISODateFormat.js
import { DateTime } from "luxon";


export function getISODateFormat(dateStr, timeStr, timeZone = "Africa/Lagos") {
  const [hourStr, minuteStr, period] = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

  const [year, month, day] = dateStr.split("-");

  const dt = DateTime.fromObject(
    {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour,
      minute,
    },
    { zone: timeZone }
  );

  return dt.toISO(); // properly returns ISO with time zone offset
}


export function formatHumanReadable(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',    // Tue
    year: 'numeric',     // 2025
    month: 'long',       // August
    day: 'numeric',      // 5
    hour: 'numeric',     // 5
    minute: '2-digit',   // 22
    second: '2-digit',   // 44
    hour12: true,        // AM/PM
    timeZoneName: 'short' // WAT, GMT, etc.
  });
}


export function hasISOTimdPassed(isoTimeString) {
  const inputTime = new Date(isoTimeString);
  const currentTime = new Date();

  return inputTime < currentTime;
}



