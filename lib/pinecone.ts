import { Pinecone } from "@pinecone-database/pinecone";

// export const pinecone = new Pinecone({
//   //@ts-ignore
//   apiKey: process.env.PINECONE_API_KEY,
// });

export const pinecone =
  process.env.PINECONE_API_KEY &&
  new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
