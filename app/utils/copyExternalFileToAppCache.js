// @flow

import type { File } from "./models.types";
import { ceil } from "lodash/math";
import { ProcessingManager } from "react-native-video-processing";
const RNFS = require("react-native-fs");
const MAX_VIDEO_SIZE = 16777216;
/**
 * Copy the specified file into internal app storage so that it can't be removed and is always
 * accessible by the app
 */
export default async function copyExternalFileToAppCache(file: File): Promise<File> {
  const fileName = file.name || extractFileNameFromUri(file.uri);
  const temporaryDir = `${RNFS.CachesDirectoryPath}/uploads`;
  const temporaryUri = `${temporaryDir}/${Date.now()}_${fileName}`;
  const copiedFile = {
    ...file,
    name: fileName,
    // Make sure file:// scheme is prepended as most things need it but RNFS does not include it
    uri: !temporaryUri.startsWith("file://") ? `file://${temporaryUri}` : temporaryUri
  };
  await RNFS.mkdir(temporaryDir);
  await RNFS.copyFile(file.uri, temporaryUri);
  return copiedFile;
}

/**
 * Extract the file name from the last part of a uri, by extracting the text after the final  "/"
 */
export function extractFileNameFromUri(uri: string): string {
  const finalForwardSlash = uri.lastIndexOf("/");

  if (finalForwardSlash < 0) {
    return uri;
  }

  return uri.substr(finalForwardSlash + 1);
}

/**
 * Compresses the video, if the size is bigger than MAX_VIDEO_SIZE (16MB).
 * @param uri of the video
 * @returns uri of the new compressed video or null if not needed
 */
export async function compressVideo(uri: string): Promise<string> {
  const videoInfo = await RNFS.stat(uri);
  let compressed = null;
  if (Number(videoInfo.size) > MAX_VIDEO_SIZE) {
    const options = {
      width: 1280,
      height: 720,
      bitrateMultiplier: ceil(Number(videoInfo.size) / MAX_VIDEO_SIZE)
    };
    compressed = await ProcessingManager.compress(uri, options);
    return compressed?.source ?? uri;
  }
  return uri;
}
