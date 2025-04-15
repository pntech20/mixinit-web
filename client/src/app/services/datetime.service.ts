import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

class DateTimeService {
  startDateOfMonth(year: string, month: string) {
    return `${year}-${month}-01T00:00:00Z`;
  }

  endDateOfMonth(year: string, month: string) {
    const date: string = dayjs(`${year}-${month}-01`).endOf('month').format();

    const dateParts = date.split('T')[0];
    const day = dateParts.split('-')[2];

    return `${year}-${month}-${day}T23:59:59Z`;
  }
  startDateUnixOfMonth(year: string, month: string): number {
    return this.unixTime(this.startDateISOOfMonth(year, month));
  }

  startDateOfCurrentMonth(): string {
    return dayjs().utc().startOf('month').format();
  }

  endDateUnixOfMonth(year: string, month: string): number {
    return this.unixTime(this.endDateISOOfMonth(year, month));
  }

  endDateOfCurrentMonth(): string {
    return dayjs().utc().endOf('month').format();
  }

  startDateISOOfCurrentMonth(): string {
    return this.convertToISO(this.startDateOfCurrentMonth());
  }

  endDateISOOfCurrentMonth(): string {
    return this.convertToISO(this.endDateOfCurrentMonth());
  }

  startDateUnixOfCurrentMonth(): number {
    return this.unixTime(this.startDateISOOfCurrentMonth());
  }

  endDateUnixOfCurrentMonth(): number {
    return this.unixTime(this.endDateISOOfCurrentMonth());
  }

  startDateUnixBeforeMonth(month: number = 0): number {
    const dateBefore = dayjs().utc().subtract(month, 'month');
    return this.unixTime(dateBefore.startOf('month').format());
  }

  endDateUnixOfBeforeMonth(month: number): number {
    const dateBefore = dayjs().utc().subtract(month, 'month');
    return this.unixTime(dateBefore.endOf('month').format());
  }

  startDateISOOfMonth(year: string, month: string): string {
    return this.convertToISO(this.startDateOfMonth(year, month));
  }

  endDateISOOfMonth(year: string, month: string): string {
    return this.convertToISO(this.endDateOfMonth(year, month));
  }

  unixTime(date?: string | Date): number {
    return dayjs(date).utc().unix();
  }

  format(date: Date, format?: string): string {
    return dayjs(date)
      .utc()
      .format(format || 'YYYY-MM-DD');
  }

  currentDate(): number {
    return dayjs().utc().date();
  }

  currentMonth(): number {
    return dayjs().utc().month() + 1;
  }

  currentYear(): number {
    return dayjs().utc().year();
  }

  currentMonthYear(format = 'MMMM YYYY'): string {
    return dayjs().utc().format(format);
  }

  convertToISO(date: string): string {
    return dayjs(date).utc().toISOString();
  }

  unixTimeToISO(unixTime: number): string {
    return dayjs.unix(unixTime).utc().toISOString();
  }
}

export default new DateTimeService();
