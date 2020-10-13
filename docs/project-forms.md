# Project forms

The key flow within the **Terramatch** apps is the project form flow. 
Specifically, it is possible to create and edit two types of project: **offers** and **pitches**, each with slightly different data requirements.

The many screens comprising this flow can be found in `./app/components/pitches/project-creation`.
Note that these screens are re-used between both the offer and pitch flows.
However, the exact screens within each flow differ, and are defined by a data structure inside `./app/screens/projectForms`

There are a number of complex requirements for these flows that have effected the design of the technical solution:
- The form screens are used for both project creation _and_ also later down the line when editing a project's details
- When creating a project, the incomplete form should be saved as a "draft" (which can be resumed by other members of the organisation)
- Forms should be automatically synced with the server after every modification (whenever there is network connectivity)
- It should be possible to use the form without a network connection wherever possible

## Launching the form flow

The key entrypoint for launching a form to create or edit a project is `./app/screens/projectForms#createOrResumeForm`.
This function takes a few parameters:
- `projectType` - whether the form should be for a `pitch` or `offer`
- `formId`, `draftId` and `projectId` are optional parameters, identifying different types of data structure. 
Different combinations of these parameters define different "modes" that the form should operate in (see section below)
    - `formId` - A locally-generated ID for the form that we use to identify the form on the local device before it has been synced to the server
    - `draftId` - The ID of a draft object as stored on the server before the project has been created (used to resume a draft)
    - `projectId` - The ID of a previously created project (used when editing).

### Modes of operation

- **Start creating a new project from scratch** 
    - Don't supply any of `formId`, `draftId` or `projectId`.
    - A new `formId` will be generated
    - If the user has network connectivity, then a draft (and `draftId`) will be created when they start modifying the form data.
- **Resume a form**
    - Supply `formId`. If no other IDs are supplied then the form is resumed (a new draft will be created when the form is synced with the server)
    - A `draftId` can optionally be supplied. This is used to reconcile the form data, as it is possible for the draft data held on the server to have diverged from the local data held on the device.
        - For instance, other members of the organisation may have modified the draft.
        - Conversely, the user may have unsynced form modifications that are not reflected in the draft.
    - To reconcile these two data sources, we use the following strategy:
        - If the local form was successfully synced with the server when it was last used, we download the draft data and use that as the source-of-truth.
        - If the local form was **not** synced with the server when it was last modified, then the local form is resumed and acts as source-of-truth. **Any changes to the remote draft will be overwritten when the form is modified**.
- **Resume a draft**
    - Supply just `draftId`
    - If a form for the draft already exists on the device then this will be resumed (see above)
    - Otherwise, the draft data is downloaded and used to create a new form (and `formId`)
- **Edit a project**
    - Supply **just** `projectId` (ID of the offer / pitch)
    - Cached project data on the local device is used as the basis for the data editable through the form
        - Any data not cached on the device will be freshly downloaded.
        - If no data is cached on the device and downloading fails, the user will not be able to edit the project
    - Forms of this type cannot be resumed later or turned into drafts. Any edits have to be performed immediately.

## Automatic form syncing

Form data is automatically synced to a _draft_ whenever the form data is modified. 
A visual indicator is shown to the user reflecting whether or not their changes are synced with the server, or whether a sync is in progress.
Users should ensure data is synced if they want other members of their organisation to modify it safely.

There are some restrictions to this functionality:
- Automatic syncing is not performed when **editing** existing (previously-created) projects
- Users must not modify drafts at the same time as other users in their team. A proper cross-device reconciliation algorithm is not supported.
    
The code responsible for syncing the project data is in `app/redux/wri-api/pitches/actions#syncPitchFormAsDraft` (and likewise for offers).
This function works as follows:
1. A payload representing the server-side draft state is either obtained from local cache, or retrieved from the server (if it is not available or there has been an error)
1. An equivalent payload is built representing the device-side draft state (including the user's modifications)
1. A deep diff between these two payload is performed, reflecting the differences between them
1. The deep diff is transformed into a [JSON patch](http://jsonpatch.com/) payload understood by the backend system
1. The JSON patch is sent to the server, instructing it to update the draft data to reflect the patched data.
1. If this succeeds then we use the server's response to update the server-side draft state stored locally

## Form submission

Upon finishing the form the user can confirm their changes in order to finally create or update the project (as opposed to the draft).
The code responsible for submitting the project is in `app/redux/wri-api/pitches/actions/syncPitchForm` (and likewise for offers)

This function works as follows:
- If the form has a draft stored server-side then sync it (using the routine described above), and then request the server to publish the draft.
- If the form does **not** have a draft stored server-side (such as when editing), then the process is slightly more complicated.
    - Each modified datapoint (i.e. pitch / offer details, certifications, contacts, documents, metrics etc.) have to be synced separately and via distinct endpoints
    - This is done in a controlled way that takes into account whether the item in question needs to be created, modified, or deleted.
    - After each modification is performed, it is marked as complete so it does not occur again (for instance if the user has to repeat the request due to connectivity issues) 
