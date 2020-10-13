/**
 * Generates Javascript API client files and models for the provided swagger API spec.
 *
 * To update:
 * (1) ensure you have a valid swagger url, e.g. https://test.wrirestorationmarketplace.cubeapis.com/documentation/raw
 * (2) run `yarn api:generate-{environment}`
 *
 * The generated API files are imported in the same way as for a normal npm dependency, like so:
 * `"wrm-api": "./scripts/api-gen/javascript-client",`
 */

const specURL = process.argv[2];

if (!specURL) {
  console.error("⚠️ Please specify a swagger path URL");
  return;
}

const fs = require("fs");
const fetch = require("node-fetch");
const unzipper = require("unzipper");
const saveLocation = `${__dirname}/api-gen`;

/**
 * Call the swagger generator API with our spec file as body
 */
console.log(`🔧 Generating codebase for ${specURL}`);
fetch("https://generator.swagger.io/api/gen/clients/javascript", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    swaggerUrl: specURL,
    options: {
      useES6: "true",
      usePromises: "true",
      modelPropertyNaming: "original"
    }
  })
})
  // The API should response with something like { ..., link: <download_uri> }
  .then(response => response.json())
  .then(responseBody => responseBody.link)
  // Now download the generated codebase (which will be in a zip)
  .then(downloadUri => {
    console.log(`⬇️  Downloading codebase from ${downloadUri}`);
    return fetch(downloadUri);
  })
  // Stream the body and pipe it through to the unzipper lib, which will extract it in this file's dir
  .then(res => {
    console.log(`📦 Extracting codebase to ${saveLocation}`);
    return new Promise((resolve, reject) => {
      res.body
        .pipe(unzipper.Extract({ path: saveLocation }))
        .on("finish", resolve)
        .on("error", reject);
    });
  })
  .then(() => console.log(`✅ Finished extracting codebase!`))
  .then(() => console.log(`⬇️  Downloading swagger spec file from ${specURL}`))
  .then(() => {
    return fetch(specURL);
  })
  .then(response => {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream("./scripts/api-gen/javascript-client/swagger-spec.yml");
      response.body.pipe(fileStream);
      response.body.on("error", err => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve();
      });
    });
  })
  .then(() => console.log(`✅ Finished`));
