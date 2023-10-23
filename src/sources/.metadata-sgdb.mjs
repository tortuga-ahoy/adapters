// import fs from "fs/promises";
// import { existsSync, createWriteStream } from "fs";
// import path from "path";
// import { app } from "electron";
// import slugify from "slugify";

// const GRIDS_PATH = path.join(app.getPath("userData"), "Grids");

// export class SGDBHandler {
//   constructor(key) {
//     this.key = key;
//   }

//   static slugifyUrl = (url) => slugify(url, { replacement: "-", lower: true });

//   async request(endpoint) {
//     try {
//       const response = await fetch(`https://www.steamgriddb.com/api/v2/${endpoint}`, {
//         headers: {
//           Authorization: `Bearer ${this.key}`,
//         },
//       });
//       const json = await response.json();
//       return json;
//     } catch (error) {
//       console.error(error);
//       return {};
//     }
//   }

//   async cacheGameGrid({ gridUrl, id }) {
//     if (!existsSync(GRIDS_PATH)) {
//       await fs.mkdir(GRIDS_PATH);
//     }
//     const destination = path.join(GRIDS_PATH, `${id}.jpg`);
//     const response = await fetch(gridUrl);
//     const buffer = await response.arrayBuffer();
//     await fs.writeFile(destination, Buffer.from(buffer));
//   }

//   async fetchGameGrid({ title }) {
//     try {
//       const games = await this.request(`search/autocomplete/${encodeURIComponent(title)}`);
//       const grids = await this.request(`grids/game/${games.data[0].id}?dimensions=600x900`);
//       return grids.data[0].url;
//     } catch (error) {
//       console.error(error);
//       return "";
//     }
//   }

//   async getGameGrid({ title, id }) {
//     const cached = path.join(GRIDS_PATH, id + ".jpg");
//     if (!existsSync(cached)) {
//       const gridUrl = await this.fetchGameGrid({ title });
//       if (!gridUrl) {
//         return null;
//       }
//       await this.cacheGameGrid({ gridUrl, id });
//     }
//     return cached;
//   }
// }
