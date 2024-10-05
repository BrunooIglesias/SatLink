@echo off

REM Start Docker containers in detached mode
docker-compose up -d

REM Keep the Command Prompt window open
echo Docker containers started. Press any key to exit...
pause
