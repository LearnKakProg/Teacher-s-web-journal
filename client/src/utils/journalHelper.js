export function getCellClass(grade) {
    if (!grade) return 'empty-cell';
  
    const absentTokens = ['Н'];
    const sickTokens   = ['Б'];
  
    if (absentTokens.includes(grade)) return 'absent-cell';
    if (sickTokens.includes(grade))   return 'sick-cell';
    if (grade >= 4.5) return 'excellent-cell';
    if (grade >= 3.5) return 'good-cell';
    if (grade >= 2.5) return 'satisfactory-cell';

    return 'grade-cell';
  }