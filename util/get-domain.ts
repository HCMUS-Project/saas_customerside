export const getDomain = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Check if hostname is localhost or not
    if (hostname === "localhost") {
      return "30shine.com";
    }

    // You can add more custom logic here for other specific domains if needed
    // For example:
    // if (hostname === "someOtherLocalHost") {
    //   return "20shine.com";
    // }

    return hostname;
  }
  return "30shine.com"; // Default domain if window is undefined
};
