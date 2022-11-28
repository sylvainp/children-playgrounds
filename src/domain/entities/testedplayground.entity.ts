export default class TestedPlaygroundEntity {
  constructor(
    public readonly userId: string,
    public readonly playgroundId: string,
    public readonly rate: number,
    public readonly comment?: string
  ) {}
}
