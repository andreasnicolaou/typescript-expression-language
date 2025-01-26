import levenshtein from 'locutus/php/strings/levenshtein';

/**
 * Represents a syntax error in an expression.
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class SyntaxError extends Error {
  constructor(
    message: string,
    cursor: number | null = null,
    expression = '',
    subject: string | number | null = null,
    proposals: (string | number)[] | null = null
  ) {
    const around = cursor != null ? ` around position ${cursor}` : '';
    let formattedMessage = `${message.replace(/\.$/, '')}${around}`;
    if (expression) {
      formattedMessage = `${formattedMessage} for expression \`${expression}\``;
    }
    formattedMessage += '.';

    if (subject !== null && proposals !== null) {
      let minScore = Infinity;
      let guess: string | number | undefined;

      for (const proposal of proposals) {
        const distance: number | undefined = levenshtein(subject, proposal);
        if (distance !== undefined && distance < minScore) {
          guess = proposal;
          minScore = distance;
        }
      }

      if (guess !== undefined && minScore < 3) {
        formattedMessage += ` Did you mean "${guess}"?`;
      }
    }

    super(formattedMessage);
    this.name = 'SyntaxError';
  }
}
