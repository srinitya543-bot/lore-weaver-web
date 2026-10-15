import os
import zipfile

def create_project_zip():
    # Target zip locations
    os.makedirs('public', exist_ok=True)
    zip_path = 'public/loreweaver-project.zip'
    
    # Excluded directories and files
    exclude_dirs = {'node_modules', '.git', '.aistudio', 'dist', '__pycache__', '.vite'}
    exclude_files = {'loreweaver-project.zip', '.env', '.DS_Store'}
    
    print(f"Creating project zip: {zip_path}")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if file in exclude_files or file.endswith('.pyc') or file.endswith('.zip'):
                    continue
                
                file_path = os.path.join(root, file)
                # Archive name relative to current directory
                arcname = os.path.relpath(file_path, '.')
                if arcname.startswith('public/loreweaver-project.zip'):
                    continue
                
                print(f"Adding: {arcname}")
                zipf.write(file_path, arcname)
                
    # Also copy to root for easy command line access
    import shutil
    shutil.copyfile(zip_path, 'loreweaver-project.zip')
    print("Successfully created public/loreweaver-project.zip and loreweaver-project.zip")

if __name__ == '__main__':
    create_project_zip()
