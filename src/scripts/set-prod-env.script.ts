import {rename, copyFile} from 'fs/promises';
async function setProdEnv() {
  try {
    await copyFile('prod.env', 'p.env');
    console.log('copied succesfully');
  } catch {
    console.error('error copying');    
  }
  try {
    await rename('p.env', '.env');
    console.log('renamed succesfully');
  } catch {
    console.error('error renaming'); 
  }
}
setProdEnv();
