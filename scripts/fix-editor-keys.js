/**
 * Quick fix to add _key properties to editor-agent.js blocks
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function fixEditorKeys() {
  const filePath = join(__dirname, 'agents', 'editor-agent.js');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Add key generator at the top of convertToSanityBlocks function
  const keyGenCode = `
    // Generate unique keys
    let blockKeyCounter = 0;
    let spanKeyCounter = 0;
    const getBlockKey = () => 'block' + (++blockKeyCounter);
    const getSpanKey = () => 'span' + (++spanKeyCounter);
  `;
  
  // Insert key generator
  content = content.replace(
    'convertToSanityBlocks(markdown) {',
    `convertToSanityBlocks(markdown) {${keyGenCode}`
  );
  
  // Add _key to all block creations
  content = content.replace(
    /_type: 'block',/g,
    `_type: 'block',\n          _key: getBlockKey(),`
  );
  
  // Add _key to all span creations
  content = content.replace(
    /{ _type: 'span', text:/g,
    `{ _type: 'span', _key: getSpanKey(), text:`
  );
  
  // Also need to add markDefs: [] to blocks
  content = content.replace(
    /children: \[{ _type: 'span'/g,
    `children: [{ _type: 'span'`
  );
  
  // Add markDefs after children array
  content = content.replace(
    /children: \[.*?\]/g,
    (match) => match + ',\n          markDefs: []'
  );
  
  await fs.writeFile(filePath, content);
  console.log('✅ Fixed _key properties in editor-agent.js');
}

fixEditorKeys().catch(console.error);