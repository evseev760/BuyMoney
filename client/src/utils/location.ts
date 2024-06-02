import { CurrentUser } from "models/Auth";

export const getLocationTitle = (location: CurrentUser["location"]) =>
  location ? `${location?.Country}, ${location.City}` : "";
