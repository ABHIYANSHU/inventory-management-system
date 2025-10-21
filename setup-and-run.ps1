# PowerShell script to install Docker Desktop and run docker-compose
# Requires Administrator privileges

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerInstalled) {
    Write-Host "Docker not found. Installing Docker Desktop..." -ForegroundColor Yellow
    
    # Download Docker Desktop installer
    $installerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    
    Write-Host "Downloading Docker Desktop..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
    
    # Install Docker Desktop
    Write-Host "Installing Docker Desktop (this may take several minutes)..." -ForegroundColor Cyan
    Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet" -Wait
    
    # Clean up installer
    Remove-Item $installerPath -Force
    
    Write-Host "Docker Desktop installed. Please restart your computer and run this script again." -ForegroundColor Green
    exit 0
}

Write-Host "Docker is installed." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "Docker is not running. Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    # Wait for Docker to start
    Write-Host "Waiting for Docker to start..." -ForegroundColor Cyan
    $timeout = 60
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 5
        $elapsed += 5
        $dockerRunning = docker info 2>$null
        if ($dockerRunning) {
            break
        }
    }
    
    if (-not $dockerRunning) {
        Write-Host "Docker failed to start. Please start Docker Desktop manually." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Docker is running." -ForegroundColor Green

# Navigate to project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Run docker-compose
Write-Host "Starting containers with docker-compose..." -ForegroundColor Cyan
docker-compose up --build -d

Write-Host "Application is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Admin: http://localhost:8000/admin (username: admin, password: admin123)" -ForegroundColor Cyan
