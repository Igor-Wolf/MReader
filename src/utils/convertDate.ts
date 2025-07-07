
import { format, parseISO } from 'date-fns';

export const DateConvert = (date: string) => {
    const newDate = format(parseISO(String(date)), 'dd/MM/yyyy');
    return newDate


}





