@echo off


REM Delete the existing Docker image if it exists
docker rmi email_sender --force
docker rmi front_end --force
docker rmi back_end --force

REM Build the new Docker image
docker build -t email_sender ./send-email

REM Build the new Docker image
docker build -t front_end ./frontend

REM Build the new Docker image
docker build -t back_end ./backend

pause
