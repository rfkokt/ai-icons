import sharp from "sharp"

export async function convertSvgToPng(svgCode: string, size = 512): Promise<Buffer> {
  return sharp(Buffer.from(svgCode))
    .resize(size, size)
    .png()
    .toBuffer()
}

export async function convertSvgToPngBase64(svgCode: string, size = 512): Promise<string> {
  const buffer = await convertSvgToPng(svgCode, size)
  return buffer.toString("base64")
}
