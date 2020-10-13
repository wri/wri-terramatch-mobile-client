// @flow

export type File = {|
  +size: ?number,
  +name: string,
  +type: ?string,
  +uri: string,

  /**
   * Optional property indicating the ID of the upload returned from the WRI API
   *
   * This is only used for the purpose of syncing draft uploads correctly, so we only do it when they have changed, and
   * when they have not previously been uploaded
   *
   * Adding in v1.1
   */
  +uploadId?: ?number
|};

export type PendingFile =
  | {|
      +type: "created",
      +file: File
    |}
  | {|
      +type: "existing",
      +file: File,
      +id: number
    |}
  | {|
      +type: "deleted",
      +file: File,
      +id: number
    |};

export type FileList = Array<File>;
export type PendingFileList = Array<PendingFile>;
export type Project = "offer" | "pitch";
export const ElevatorStatus = Object.freeze({
  FINISHED: "finished",
  PROCESSING: "processing",
  ERRORED: "errored",
  TIMEOUT: "timed_out"
});
