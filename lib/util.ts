import { Readable } from "stream";
import { StringDecoder } from "string_decoder";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

export type HttpHeaders = { [key: string]: string };

type ConstructHeadResult = {
  method: HttpMethod;
  url: string;
  protocol: string;
  headers: HttpHeaders;
};

const NL_CHAR = '\r\n';
const BODY_DELIMITER = NL_CHAR + NL_CHAR;

const constructHead = (content: string): ConstructHeadResult => {
  const [metaPart, ...rest] = content.split(NL_CHAR);
  const [method, url, protocol] = metaPart.split(" ");
  const headers = rest.reduce((acc, line) => {
    const [key, ...value] = line.split(":");
    return { ...acc, [key]: value.join(":").trim() };
  }, {});
  return {
    method: method as HttpMethod,
    url,
    protocol,
    headers,
  };
};

export const parseHead = (
  stream: Readable,
  cb: () => void
): Promise<ConstructHeadResult> => {
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

    // Read headers' part from the last chunk
    const [headPart, bodyPart] = chunkContent.split(BODY_DELIMITER);
    if (bodyPart !== undefined) {
      const buf = Buffer.from(bodyPart, "utf8");

      // Need to remove event listeneres
      cb();
      if (buf.length > 0) {
        stream.unshift(buf);
      }
    }

    resolve(constructHead(content + headPart));
  });
};
