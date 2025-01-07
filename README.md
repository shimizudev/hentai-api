# Hentai API 

[![GitHub Issues](https://img.shields.io/github/issues/shimizudev/hentai-api)](https://github.com/shimizudev/hentai-api/issues) [![License](https://img.shields.io/github/license/shimizudev/hentai-api)](https://github.com/shimizudev/hentai-api/blob/main/LICENSE)

A versatile API that scrapes data from multiple providers, offering a wide range of content.

## Providers
- [x] **Hentai Anime**
    - [x] HAnime
    - [x] HentaiHaven
    - [ ] HentaiStream (planned)
    - [ ] HentaiFreak (planned)
    - [ ] Hentaimama (planned)
- [x] **Gallery/Fanmade**
    - [x] Rule34
- [ ] **Hentai Manga**
    - [ ] Hentai2Read (planned)
    - [ ] NHentai (planned)
    - [ ] HentaiFox (planned)

## Installation

Ready to get started? Follow these simple steps to install and run the API on your machine:

### Requirements
- [Node.js 20.x or higher](https://nodejs.org/en/download)  [![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download)
- [Bun 1.1.x or higher](https://bun.sh)  [![Bun](https://img.shields.io/badge/Bun-%23F0C030.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)

### Installation
First, clone the repository:
```bash
git clone https://github.com/shimizudev/hentai-api.git
```

Then, navigate to the project directory and install the dependencies:
```bash
cd hentai-api
bun install
```

### Configuration
Create a `.env` file in the root directory of the project and add the following variables:
```bash
MONGODB_URL=mongodb://localhost:27017/hentai-api # Not required
# REDIS. You can use upstash redis for free. This is required for running the API. Will be optional in the future.
REDIS_HOST=localhost # Required.
REDIS_PASSWORD=password # Required
```

### Running the API
To run the API in development mode, use the following command:
```bash
bun run dev # Will start a development server
```

### Production Server
To run the API in production, you need to set the `NODE_ENV` variable in your `.env` file:
```env
# ... rest of your env
NODE_ENV=production
```

Then, use the following command to start the production server:
```bash
bun run start # Will start a production server
```

The API will be accessible on port 3000 by default.

## Docker Installation

Prefer Docker? Here's how to run the API using Docker:

### Requirements
- [Docker](https://www.docker.com/)  [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

### Installation
First, clone the repository:
```bash
git clone https://github.com/shimizudev/hentai-api.git
```

Then, build the Docker image:
```bash
cd hentai-api
docker build -t hentai-api .
```

### Configuration
Create a `.env` file in the root directory of the project and add the following variables:
```bash
MONGODB_URL=mongodb://localhost:27017/hentai-api
REDIS_HOST=localhost
REDIS_PASSWORD=password
```
**Note:** You can also pass these environment variables directly to the `docker run` command.

### Running the API
To run the API using Docker, use the following command:
```bash
docker run -p 3000:3000 -d hentai-api
```
The API will be accessible on port 3000 by default.

## Contributing

Contributions are highly appreciated! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more information.