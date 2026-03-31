
import { format, parseISO , isValid, parse} from 'date-fns';

export const DateConvert = (date: string) => {
    const newDate = format(parseISO(String(date)), 'dd/MM/yyyy');
    return newDate


}



export const DateConvertNineManga = (date: string): string => {
  // Tenta fazer o parse da data
  const dataParseada = parse(date, 'MMM d, yyyy', new Date())

  // Verifica se a data é válida
  if (isValid(dataParseada)) {
    return format(dataParseada, 'dd/MM/yyyy')
  } else {
    // Se a data for inválida, usa a data atual como fallback
    const dataAtual = new Date()
    return format(dataAtual, 'dd/MM/yyyy')
  }
}





