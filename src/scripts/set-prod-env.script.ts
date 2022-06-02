import {rename, copyFile, readFile} from 'fs/promises';
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
  try {
    const buffer = await readFile('./.env');
    console.log(buffer.toString());
    
  } catch (error) {
    console.error('error reading .env'); 
    console.error(error); 
    
  }
}
setProdEnv();
