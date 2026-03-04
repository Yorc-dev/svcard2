import config from './config';

export const Query = {
  parse: function (query: string) {
    const str = query[0] === '?' ? query.substr(1) : query;
    const res: any = {};
    str.split('&').forEach(el => {
      const tmp = el.split('=');
      if (tmp.length === 2) res[tmp[0]] = tmp[1];
    });
    return res;
  },
  stringify: function (data: any) {
    return Object.keys(data).length ? ('?' + Object.keys(data).map(key => typeof data[key] === 'object' ?
      Object.keys(data[key]).map(k => key + '[' + k + ']=' + data[key][k]).join('&') :
      key + '=' + data[key]).join('&')) : '';
  }
};

export const Numb = {
  merge: function (number: any) {
    return number.replace(/\D+/g, '');
  },
  split: function (number: any = '', factor: number = 3, symbol: string = ' ') {
    let str = '', numberStr = String(number);
    if (!factor || factor <= 0) return numberStr;
    while (numberStr.length) {
      if (numberStr.length > factor) {
        str = String(symbol) + numberStr.substring(numberStr.length - factor, numberStr.length) + str;
        numberStr = numberStr.substring(0, numberStr.length - factor);
      } else {
        str = numberStr + str;
        numberStr = '';
      }
    }
    return str;
  }
};

export function sortArrayOfObjectsByKey (array: any[], key: string, reverse: boolean = false) {
  const arr = [...array];
  const result = array.map(el => el[key]).sort()
    .map(value => arr.splice(arr.findIndex(el => el[key] === value), 1)[0]);
  return reverse ? result.reverse() : result;
}

export function fileNameSeparation (data: any) {
  const res = { name: '', link: '' };
  if (!data || !data.link) return res;
  res.name = data.name || data.link.substr(data.link.indexOf('/') + 1);
  if (data.link.indexOf('http') >= 0) res.link = data.link;
  else res.link = config.storageUrl + data.link;
  return res;
}

export function prepareFormData (data: any, name: string, acc: any) {
  const res: any = acc || [];
  if (typeof data === 'object')
    if (Object.keys(data).length === 0) res.push({key: name || '', value: data});
    else Object.keys(data).forEach(key => prepareFormData(data[key], name ? `${name}[${key}]` : key, res));
  else res.push({key: name || '', value: data});
  return res;
}

export function getFormData (object: any) {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData;
}

export function getParamsOfFileByUrl (url: string): {name: string, ext: string, type: string} {
  function getType (ext: string = ''): string {
    const imageTypes = ['jpeg', 'jpg', 'jfif', 'pjpeg', 'pjp', 'png', 'apng', 'gif', 'bmp', 'svg', 'webp'];
    const videoTypes = ['mp4', 'webm'];
    const audioTypes = ['mp3', 'aac', 'ogg', 'wav'];
    if (imageTypes.includes(ext.toLowerCase())) return 'image';
    if (videoTypes.includes(ext.toLowerCase())) return 'video';
    if (audioTypes.includes(ext.toLowerCase())) return 'audio';
    return '';
  }

  const res = {name: '', ext: '', type: ''};

  try {
    res.name = url.split('/').reverse()[0];
    res.ext = res.name.split('.').reverse()[0];
    res.type = getType(res.ext);
  } catch (e) {}

  return res;
}
