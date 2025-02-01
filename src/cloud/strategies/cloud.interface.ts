export interface CloudStrategy {
  generateSASToken(filename: string): Promise<string>;
}
