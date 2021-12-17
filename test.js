const Sync = require('./index.js'); // eslint-disable-line

const spreadSheetId = process.env.SPREADSHEETID;
const googleApiKey = process.env.GOOGLE_API_KEY;
// Find here -> https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0

Sync({
  spreadSheetId, // required The speadsheet is
  pathMessages: 'src/i18n', // required Path where json files will be generated
  googleApiKey, // required  Api key for google-sheet api (see more here  https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=api-key)
  tabIndex: 0, // export specific tab index, if you want export all tabs, don't define this option
})
  .then(() => {
    console.log('done !');
  })
  .catch(err => {
    console.log('SYNC MESSAGES FAILED:', err);
  });
