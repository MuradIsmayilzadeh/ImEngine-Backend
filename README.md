# ImEngine Backend

Plugin registry API for [ImEngine](https://github.com/MuradIsmayilzadeh/ImEngine), built with Express and JSON-file storage. Open `/` in a browser for a web UI to browse, publish and remove plugins.

## API
| Method | Route | Description |
|---|---|---|
| GET | `/plugins?q=` | List plugins, with optional search |
| GET | `/plugins/:id` | Get one plugin |
| POST | `/plugins` | Create a plugin: `{ name, description, version }` |
| DELETE | `/plugins/:id` | Remove a plugin |
| GET | `/health` | Health check |

## Running
```bash
npm install
npm start   # http://localhost:8000 (set PORT to change)
```
