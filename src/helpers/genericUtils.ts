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
}
