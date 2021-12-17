import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import jsonfile from 'jsonfile';
import path from 'path';
import { MessagesType, SyncOptionsType } from './indexType';

const sync = async ({ spreadSheetId, pathMessages, googleApiKey, tabIndex = 0 }: SyncOptionsType) => {
  if (!spreadSheetId) {
    throw new Error('spreadSheetId must be defined');
  }
  if (!pathMessages) {
    throw new Error('pathMessages must be defined');
  }
  if (!googleApiKey) {
    throw new Error('googleApiKey must be defined');
  }
  const sheet = new GoogleSpreadsheet(spreadSheetId);
  sheet.useApiKey(googleApiKey);
  const toIgnores = ['key', '_xml', 'save', 'del', '_links', 'id'];

  const getTabs = async () => {
    try {
      await sheet.loadInfo();
      return sheet.sheetsByIndex;
    } catch (err) {
      throw err;
    }
  };

  const getLanguages = (row: GoogleSpreadsheetRow) => {
    return Object.keys(row).filter((key) => {
      if (toIgnores.indexOf(key) === -1) {
        return true;
      }
      return false;
    });
  };

  const getMessagesByTab = async (tab: GoogleSpreadsheetWorksheet) => {
    try {
      const rows = await tab.getRows();
      const messages: MessagesType = {};
      const languages = getLanguages(rows[0]);
      languages.forEach((language) => {
        messages[language] = {};
      });
      rows.forEach((row) => {
        languages.forEach((language) => {
          messages[language][row.key] = row[language];
          return true;
        });
        return messages;
      });

      return messages;
    } catch (err) {
      throw err;
    }
  };

  const getAllMessages = async (tabs: GoogleSpreadsheetWorksheet[]) => {
    try {
      const toRun = tabIndex > -1 ? [getMessagesByTab(tabs[tabIndex])] :
        tabs.map((tab) => {
          return getMessagesByTab(tab);
        });
      const result = await Promise.all(toRun);
      let allMessages: MessagesType = {};
      result.forEach(messages => {
        Object.keys(messages).forEach(code => {
          allMessages[code] = { ...allMessages[code], ...messages[code] };
        });
      });
      return allMessages;
    } catch (err) {
      throw err;
    }
  }

  const saveToJson = async (messages: MessagesType) => {
    Object.keys(messages).forEach((code) => {
      jsonfile.writeFile(`${path.normalize(pathMessages)}/${code}.json`, messages[code], (err) => {
        if (err) throw err;
        console.log(`-- 📖  ${code}.json generated`);
        return true;
      });
    });
  };

  try {
    const tabs = await getTabs();
    const messages = await getAllMessages(tabs);
    return saveToJson(messages);
  } catch (err) {
    throw err;
  }

}

module.exports = sync;
