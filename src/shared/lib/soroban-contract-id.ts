const SOROBAN_CONTRACT_ID_PATTERN = /^C[A-Z0-9]{55}$/;

export function isSorobanContractId(value: string): boolean {
  return SOROBAN_CONTRACT_ID_PATTERN.test(value.trim());
}
