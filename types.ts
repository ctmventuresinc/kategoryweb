export enum Category {
  BoyName = "Boy Name",
  GirlName = "Girl Name",
  Animal = "Animal",
  Place = "Place",
  Thing = "Thing",
  TvOrMovie = "TV/Movie",
}

export interface UserAnswers {
  boyName?: string
  girlName?: string
  animal?: string
  place?: string
  thing?: string
  tvOrMovie?: string
}

