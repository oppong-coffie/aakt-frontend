const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Labels
    content = content.replace(/label:\s*"Process"/g, 'label: "Tasks"');
    content = content.replace(/label:\s*'Process'/g, "label: 'Tasks'");
    
    content = content.replace(/label:\s*"Block"/g, 'label: "Documents"');
    content = content.replace(/label:\s*'Block'/g, "label: 'Documents'");

    content = content.replace(/label:\s*"Processes"/g, 'label: "Tasks"');
    content = content.replace(/label:\s*'Processes'/g, "label: 'Tasks'");
    
    content = content.replace(/label:\s*"Blocks"/g, 'label: "Documents"');
    content = content.replace(/label:\s*'Blocks'/g, "label: 'Documents'");
    
    // JSX Text Nodes
    content = content.replace(/>Process</g, '>Tasks<');
    content = content.replace(/>Processes</g, '>Tasks<');
    content = content.replace(/>Block</g, '>Documents<');
    content = content.replace(/>Blocks</g, '>Documents<');
    
    // Standalone exact strings
    content = content.replace(/"Processes"/g, '"Tasks"');
    content = content.replace(/'Processes'/g, "'Tasks'");
    content = content.replace(/"Blocks"/g, '"Documents"');
    content = content.replace(/'Blocks'/g, "'Documents'");
    content = content.replace(/"Process"/g, '"Tasks"'); 
    content = content.replace(/'Process'/g, "'Tasks'");
    content = content.replace(/"Block"/g, '"Documents"'); 
    content = content.replace(/'Block'/g, "'Documents'");

    // Special cases for placeholders
    content = content.replace(/processes, projects, blocks, operations/g, 'tasks, projects, documents, operations');
    content = content.replace(/blocks and processes/gi, 'documents and tasks');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
