// @flow

import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

/**
 * Returns an identifier for the current app installation.
 *
 * Note that this is different from a "device" ID which would be expected to remain constant throughout the lifetime of
 * a device (even across installations). iOS and modern versions of Android do not provide such a concept for privacy reasons.
 *
 * @return {Promise<string>}
 */
export default async function installationId(): Promise<string> {
  // Don't use getUniqueID on Android because on older versions it corresponds to a device ID, not an installation ID
  if (Platform.OS === "android") {
    return await DeviceInfo.getInstanceId();
  }

  return await DeviceInfo.getUniqueId();
}
