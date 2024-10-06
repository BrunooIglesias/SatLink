# NASA-Challenge

NASA-Challenge is a project that interacts with Google Earth APIs and includes email notifications via SMTP. This project runs entirely on Docker for easy setup and scalability.

## Prerequisites

Before running the project, you'll need:

- **Google Earth API Key**: You must have a valid Google Earth API key.
- **SMTP Account**: An SMTP account is required to send emails from the app.

**Note:** The credentials committed in the repository have already been revoked. You'll need to replace them with your own credentials.

## How to Run

The project is fully Dockerized, allowing you to build and run all components easily. Follow these steps to get started:

1. **Stop existing containers**  
   Run the `stopdocker.bat` script if you have any running containers from previous sessions.

2. **Build Docker images**  
   Run the `run.bat` script to build the necessary Docker images for the project.

3. **Start the containers**  
   Run the `dockerup.bat` script to spin up all four containers as part of a single Docker instance.

.bat files are for Windows, run the commands inside them manually for Linux or MacOS

## Considerations

This project was developed under time constraints during a 2-day hackathon. As such, you may notice:

- **Lack of clean code**: The code is functional but not fully optimized or structured according to best practices.
- **Missing standard practices**: Code comments, modularity, and comprehensive error handling might be incomplete.

The focus was on delivering a working prototype rather than polished production code. Further improvements and refactoring are welcome!



## To-Do

- [ ] Move credentials to a `.env` file for better security and configuration management.
- [ ] Persist the database:
  - **Option 1**: Host the database on a cloud provider such as AWS for reliable storage.
  
---

Feel free to contribute and enhance the project!
