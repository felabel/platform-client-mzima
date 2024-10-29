import { SafeUrl } from '@angular/platform-browser';
import { ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { MediaFile } from '../interfaces/media';

export function getDocumentThumbnail(mediaFile: MediaFile) {
  const path = '/assets/images/logos/';
  let thumbnail = 'unknown_document.png';
  switch (mediaFile.mimeType) {
    case 'application/pdf':
      thumbnail = 'pdf_document.png';
      break;
    case 'application/msword':
      thumbnail = 'word_document.png';
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      thumbnail = 'word_document.png';
      break;
  }
  return path + thumbnail;
}

export function getFileSize(mediaFile: MediaFile): string {
  let filesize = 0;
  if (mediaFile.status === 'ready') filesize = mediaFile.size!;
  else filesize = mediaFile.file ? mediaFile.file.size : 0;

  // Megabytes
  if (filesize > 1000000) {
    return (filesize / 1000000).toFixed(2).toString() + 'MB';
  }
  // Kilobytes
  else if (filesize > 1000) {
    return (filesize / 1000).toFixed(2).toString() + 'kB';
  }
  // Bytes
  else {
    return filesize + 'bytes';
  }
}

// Our media api returns a relative url with a filename that has an id prepended, instead of the original filename.
// This function attempts to take that url, and return the original filename.
export function getFileNameFromUrl(url: string | SafeUrl): string {
  const urlToCheck = unwrapSafeValue(url);

  // Try to use a regex to strip out what we add to the filename and the path
  const regex = /.*\/[0-9a-fA-F]{13}-(.*)/;
  const match = urlToCheck.match(regex);
  if (match && match[1]) return match[1];

  // The url doesnt have the expected filename, so return everything after the final slash
  const lastSlashIndex = urlToCheck.lastIndexOf('/');
  const newFilename = lastSlashIndex !== -1 ? urlToCheck.substring(lastSlashIndex + 1) : urlToCheck;
  const firstHyphenIndex = newFilename.indexOf('-') + 1;
  return newFilename.substring(firstHyphenIndex);
}
