const WEEKLY_TEMPLATE = {
  Monday:    { type: 'green',  maxMinutes: 90, label: 'Green Day — Deep Study', sublabel: 'Up to 90 min across 3 sessions' },
  Tuesday:   { type: 'yellow', maxMinutes: 20, label: 'Yellow Day — Light Review', sublabel: '20 min max. Wind-down mode.' },
  Wednesday: { type: 'yellow', maxMinutes: 20, label: 'Yellow Day — Light Review', sublabel: '20 min max. Wind-down mode.' },
  Thursday:  { type: 'yellow', maxMinutes: 20, label: 'Yellow Day — Light Review', sublabel: '20 min max. Wind-down mode.' },
  Friday:    { type: 'yellow', maxMinutes: 20, label: 'Yellow Day — Light Review', sublabel: '20 min max. Wind-down mode.' },
  Saturday:  { type: 'green',  maxMinutes: 90, label: 'Green Day — Deep Study', sublabel: 'Up to 90 min across 3 sessions. Weekend deep-dive.' },
  Sunday:    { type: 'green',  maxMinutes: 90, label: 'Green Day — Deep Study', sublabel: 'Up to 90 min across 3 sessions. Monday is bridge day.' },
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getTodaySchedule() {
  const dayName = DAYS[new Date().getDay()];
  return WEEKLY_TEMPLATE[dayName];
}

export function getDayType() {
  return getTodaySchedule().type;
}

export function getRecommendedQuestionCount() {
  const schedule = getTodaySchedule();
  return schedule.type === 'green' ? 20 : 10;
}

export function getRecommendedSessionMinutes() {
  const schedule = getTodaySchedule();
  return schedule.type === 'green' ? 30 : 15;
}
