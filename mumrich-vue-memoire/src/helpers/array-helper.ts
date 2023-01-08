export function popN<TArray>(nbrOfPops: number, array: TArray[]): TArray[] {
  const pops: TArray[] = [];

  while (nbrOfPops > 0 && array.length > 0) {
    nbrOfPops--;
    const pop = array.pop();

    if (pop) {
      pops.push(pop);
    }
  }

  return pops;
}
