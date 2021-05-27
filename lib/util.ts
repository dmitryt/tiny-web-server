import { Readable } from "stream";
import { StringDecoder } from "string_decoder";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

export type HttpHeaders = { [key: string]: string };
export type HttpParams = { [key: string]: any };

type ConstructHeadResult = {
  method: HttpMethod;
  url: string;
  protocol: string;
  headers: HttpHeaders;
};

export const NL_CHAR = '\r\n';
export const BODY_DELIMITER = NL_CHAR + NL_CHAR;

const constructHead = (content: string): ConstructHeadResult => {
  const [metaPart, ...rest] = content.split(NL_CHAR);
  const [method, url, protocol] = metaPart.split(" ");
  const headers = rest.reduce((acc, line) => {
    const [key, ...value] = line.split(":");
    return { ...acc, [key.toLowerCase()]: value.join(":").trim() };
  }, {});
  return {
    method: method as HttpMethod,
    url,
    protocol,
    headers,
  };
};

type ReadFromStreamResult = {
  content: any;
  lastChunk: any;
}

export const readFromStream = (
  stream: Readable
): Promise<ReadFromStreamResult> => {
  const decoder = new StringDecoder("utf8");

  return new Promise((resolve) => {
    let content = "";
    let chunkContent = "";
    let chunk = stream.read();
    while (chunk !== null) {
      chunkContent = decoder.write(chunk);
      if (chunkContent.match(BODY_DELIMITER)) {
        break;
      }
      content += chunkContent;
      chunk = stream.read();
    }

    resolve({ content, lastChunk: chunkContent });
  });
};

export const parseHead = async (
  stream: Readable,
  cb: () => void
): Promise<ConstructHeadResult> => {
  const { lastChunk, content } = await readFromStream(stream);
  // Read headers' part from the last chunk
  const [headPart, bodyPart] = lastChunk.split(BODY_DELIMITER);
  if (bodyPart !== undefined) {
    const buf = Buffer.from(bodyPart, "utf8");

    // Need to remove event listeneres
    cb();
    if (buf.length > 0) {
      stream.unshift(buf);
    }
  }

  return constructHead(content + headPart)
};

export const parseBody = async (
  stream: Readable,
): Promise<any> => {
  const { content } = await readFromStream(stream);
  return content;
};
