export enum PostStatus {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  ENDED = "ENDED",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}


export enum Category {
  TECHNOLOGY = "TECHNOLOGY",
  BUSINESS = "BUSINESS",
  ART = "ART",
  SCIENCE = "SCIENCE",
  HEALTH = "HEALTH",
  HISTORY = "HISTORY",
  LITERATURE = "LITERATURE",
  MUSIC = "MUSIC",
  SPORTS = "SPORTS",
  TRAVEL = "TRAVEL",
  FOOD = "FOOD",
  FASHION = "FASHION",
  GAMING = "GAMING",
  FILM = "FILM",
  ENVIRONMENT = "ENVIRONMENT",
  POLITICS = "POLITICS",
  PSYCHOLOGY = "PSYCHOLOGY",
  PHILOSOPHY = "PHILOSOPHY",
  ECONOMICS = "ECONOMICS",
}

export const CATEGORIES = Object.values(Category);


export enum Languages {
  ENGLISH = "English",
  HINDI = "Hindi",
  SPANISH = "Spanish",
  FRENCH = "French",
  GERMAN = "German",
  JAPANESE = "Japanese",
  KOREAN = "Korean",
  MANDARIN = "Mandarin",
  PORTUGUESE = "Portuguese",
  ARABIC = "Arabic",
  RUSSIAN = "Russian",
  ITALIAN = "Italian",
  DUTCH = "Dutch",
  SWEDISH = "Swedish",
  TURKISH = "Turkish",
} 

export const STATUS_FILTERS = ["All", "LIVE", "UPCOMING"] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];