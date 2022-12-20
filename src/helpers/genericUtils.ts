import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';
export default class Utils {
  static splitFullname = (fullname: string) => {
    const nameSplitted = fullname.split(' ');
    const halfSize = Math.trunc(nameSplitted.length / 2);
    let firstName = '',
      lastName = '';

    for (let index = 0; index < nameSplitted.length; index++) {
      const element = nameSplitted[index] as string;
      if (index < halfSize) firstName += `${element} `;
      else lastName += `${element} `;
    }

    return {
      firstName,
      lastName,
    };
  };
  static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  static isValidEmail = (email: string) =>
    /^[a-zA-Z0-9_\-.~]{2,}@[a-zA-Z0-9_\-.~]{2,}\.[a-zA-Z]{2,4}$/.test(email);

  static getDataChunked = <T>(dataArray: T[], chunkSize = 10) => {
    const chunks = [];

    for (let i = 0; i < dataArray.length; i += chunkSize) {
      chunks.push(dataArray.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static saveFile = async (fileName: string, data: any) => {
    const filePath = path.join(cwd(), '/storage', fileName);
    fs.stat(filePath, (error, stats) => {
      if (error) {
        fs.writeFile(filePath, JSON.stringify(data), (error) => {
          if (error) this.saveFile('logs/error.txt', error);
        });
      } else {
        fs.appendFile(filePath, JSON.stringify(data), (error) => {
          if (error) this.saveFile('logs/error.txt', error);
        });
      }
    });
  };

  static readJsonFile(path : string) {
    try {
      const result = fs.readFileSync(path);
      return JSON.parse(result.toString());
    } catch (error) {
      return;
    }
  }
}
