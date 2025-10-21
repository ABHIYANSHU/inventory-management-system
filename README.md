# inventory-management-system
Django & React

## Quick Start (Windows)

### Automated Setup
1. Open PowerShell as Administrator (Right-click PowerShell → Run as Administrator)
2. Navigate to project directory:
   ```powershell
   cd "{path-to-repo}\inventory-management-system"
   ```
3. Run the setup script:
   ```powershell
   .\setup-and-run.ps1
   ```

**Note:** If Docker is newly installed, restart your computer and run the script again.

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin
  - Username: `admin`
  - Password: `admin123`

## Manual Setup

If you prefer manual setup or the script doesn't work:

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Restart your computer
3. Open PowerShell in project directory
4. Run:
   ```powershell
   docker-compose up --build
   ```

## Stopping the Application

Press `Ctrl+C` in the terminal, then run:
```powershell
docker-compose down
```
