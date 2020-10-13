# WRI Terramatch mobile app

> _Help people and funders grow a trillion trees together._

Mobile Client for the WRI Terramatch apps. Android and iOS apps created using React Native.

## Getting started

### Prerequisites
- Install the latest LTS release of `node` ([instructions](https://nodejs.org/en/download/package-manager/))
- Install the most recent React Native CLI tools.
- Install the most recent version of `yarn`
- Prepare iOS environment if needed
    - Install XCode ([instructions](https://itunes.apple.com/us/app/xcode/id497799835?mt=12))
    - Install XCode CLI Tools: `xcode-select --install`
    - Install CocoaPods ([instructions](https://cocoapods.org/))
- Prepare Android environment if needed
    - Install Android SDK ([instructions](https://developer.android.com/studio))
- Configure app
    - Supply valid environment files based on `.env.sample`
        - By default the app is configured to work with development, test, staging and production environments
        - You will need to define `.env.android.dev`, `.env.android.test`, `.env.android.staging`, `.env.android.prod` respectively, depending on which environments you want to use.
            - The same applies for iOS: `.env.ios.dev` etc.
        - You will need to setup and supply some of the environment variables yourself (continue reading below)
    - Setup [Firebase](https://rnfirebase.io/) for analytics
        - You will want to setup apps within your Firebase project, one for each of the environments you want to run the app against (of the 4 available)
        - Place `google-services.json` in `./android/app/`
        - Place `GoogleService-Info.plist` in `./ios/`
    - Setup [Mapbox](https://github.com/react-native-mapbox-gl/maps/blob/master/docs/GettingStarted.md) for mapping functionality
        - Make sure you define `MAPBOX_TOKEN` in the `env` files
    - Setup [Sentry](https://github.com/getsentry/sentry-react-native) for crash reporting
        - Place `sentry.properties` in `./ios` and `./android`
        - Make sure you define `SENTRY_DSN` in the `env` files

### Run the app
- Run `yarn` to install dependencies and [apply local patches](./PATCHES.md)
- Run `yarn android` or `yarn ios` to run the app on a connected device / emulator against the development environment
    - Use `yarn android:[dev|test|staging|prod]` to run the app against a different environment

## How do I...

### ...regenerate the API client?

The API client is auto-generated from an OpenAPI specification. To regenerate it do the following:

1. Run `yarn api:generate-test` to regenerate the API client from a downloaded Swagger spec
1. Run `yarn` to install the updated wri-api dependency
1. Double check it's installed properly inside `node_modules`

Next, you may want to check there have been no breaking changes that will effect the app.
You can make this easier by updating the flow type definitions used for the API client.
1. Open `./flow-typed/wri-api_vx.x.x.js` and copy all the type definitions inside `declare module 'wri-api' { ... }`
1. Delete  `./flow-typed/wri-api_vx.x.x.js`
1. Run `yarn flow:update-lib-types` to re-generate flow lib defs
1. Copy the flow type definitions back into `declare module 'wri-api' { ... }`
1. Use the Git diff to understand if any API models were changed when the API was regenerated
1. If they have, then update any corresponding types inside `wri-api_vx.x.x.js`. This will flag any breaking changes in our main codebase.
1. Run `yarn flow check` to understand if any of the API changes have broken our code, and fix if needed

### ...get the latest translations?

Make sure the following values are defined in the `.env` file. These can be obtained from Transifex.

```bash
TRANSIFEX_URL=
TRANSIFEX_PROJECT=
TRANSIFEX_SLUG=
TRANSIFEX_API_TOKEN=
LOCALES_PATH=app/locales
```

Once done, do the following:
1. Run `yarn transifex:pull` to pull the latest translations from Transifex.
1. Review the changes. 
    1. Make sure no strings have been deleted that shouldn't have.
    1. If strings have been deleted, then you'll need to revert those deletions in the master file (`app/locales/master.json`), and then push the translations back up to Transifex (see next section).
1. Commit changes to git repo.

### ...add new strings to be translated?

Make sure the `.env` file is configured as per the question above.

1. Run `yarn transifex:pull`.
    1. This will make sure you're basing your changes on top of the latest copy from Transifex, and therefore aren't erasing other people's changes.
1. Add your new keys locally to the master file (`app/locales/master.json`)
1. Run `yarn transifex:push` to store them on Transifex.
1. Run `yarn transifex:pull` again.
    1. This will give you updated language files, with your new master keys included.
1. Try to minimise the time between step 1 and 4, or possibly other people will have pushed keys in the interim which will get overwritten.
1. Commit changes to git repo.

### ...deploy the app?

The app can be deployed to the Apple App Store and Android Play Store in the standard ways. 
However, due to the size of some bundled assets it will need to be deployed as an Android App Bundle instead of a standard APK.
This will result in optimised APKs being served to the end user at the point of download.

### ...understand how forms are implemented in the app?

Read [this document](./docs/project-forms.md)!

## Other information

- [Project form creation / editing technical overview](./docs/project-forms.md)
- [Changelog](./CHANGELOG.md)

## License
MIT License

Developed by 3 Sided Cube
