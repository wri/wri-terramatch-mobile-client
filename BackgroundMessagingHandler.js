import { handleNotification } from "./app/utils/pushNotifications";

/**
 * Entry point supporting background push notifications on Android-only
 *
 * We need this for certain pushes which are sent with data payloads as these are not automaticlly displayed while the
 * app is closed. Instead our headless service will be launched and we will manually display them.
 *
 * This async function only has 30 seconds to run
 *
 * @param message
 * @return {Promise<void>}
 */
export default async message => {
  return await handleNotification(message);
};
