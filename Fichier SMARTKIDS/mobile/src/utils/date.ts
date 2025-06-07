export const dateObjToTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}h${minutes}`;
  };
  
  export const DAY_INDEXES = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  /**
   * Convert a time label in the format "HHhMM" to an ISO time string
   * taking into account the user's time zone.
   * The final format must be "HH:MM:SSZ"
   *
   * @param timeLabel A time label in the format "HHhMM"
   */
  export const timeLabelToIsoTimeStr = (timeLabel: string) => {
    const [hours, minutes] = timeLabel.split("h");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toISOString().split("T")[1];
  };

  export const timeLabelToTimeStr = (timeLabel: string): string => {
    const [hours, minutes] = timeLabel.split("h");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Set seconds and milliseconds to 0
  
    // Format hours and minutes as "HH:mm"
    const formattedHours = date.getHours().toString().padStart(2, "0");
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}`;
  };
  
  export const isoTimeStrToTimeLabel = (isoTimeStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const isoDateStr = `${today}T${isoTimeStr}`;
    const [hours, minutes] = new Date(isoDateStr)
      .toLocaleTimeString("fr-FR")
      .split(":");
    return `${hours}h${minutes}`;
  };
  
  export const formatIsoTimeToStr = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}h${minutes}`;
  };