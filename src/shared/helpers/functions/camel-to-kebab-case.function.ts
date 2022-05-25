export const camelToKebabCase = (str: string) => { 
  return str.split('').map((letter, idx) => {
    const separator = idx !== 0 ? '-' : '';
    return letter.toUpperCase() === letter
     ? `${separator}${letter.toLowerCase()}`
     : letter;
  }).join('');
}