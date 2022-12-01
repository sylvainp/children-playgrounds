/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config();
const fs = require("fs");
const xmlParser = require("xml2json");
const format = require("xml-formatter");

const androidManifestFile = "./android/app/src/main/AndroidManifest.xml";
const apikey = process.env.GOOGLE_MAP_API_KEY;

fs.readFile(androidManifestFile, "utf8", (err, data) => {
  const xmlObj = xmlParser.toJson(data, { reversible: true, object: true });
  if (err) {
    console.error(err);
    return;
  }
  xmlObj.manifest.application["meta-data"]["android:value"] = apikey;
  const xml = xmlParser.toXml(xmlObj);
  const formattedXml = format(xml, { collapseContent: false });
  fs.writeFile(androidManifestFile, formattedXml, (err, data) => {
    if (err) {
      console.error({ err });
    }
  });
});
