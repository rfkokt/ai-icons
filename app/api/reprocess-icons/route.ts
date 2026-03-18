import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { uploadFile } from "@/lib/r2"
import sharp from "sharp"

async function makeTransparent(buffer: Buffer): Promise<Buffer> {
  try {
    // Step 1: Resize with transparent background
    let processed = await sharp(buffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    // Step 2: Get raw pixel data with alpha channel
    const { data, info } = await sharp(processed)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Step 3: Make light gray/white pixels transparent (RGB >= 230)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      if (r >= 230 && g >= 230 && b >= 230) {
        data[i + 3] = 0
      }
    }

    // Step 4: Convert back to PNG
    return await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      }
    }).png().toBuffer()
  } catch (error) {
    console.error("Error making transparent:", error)
    throw error
  }
}

export async function POST() {
  try {
    console.log("Fetching all icons...")
    
    // Fetch all icons with png_key
    const { data: icons, error } = await supabaseAdmin
      .from("generated_icons")
      .select("id, png_key, png_url")
      .not("png_key", "is", null)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Found ${icons?.length || 0} icons to process`)

    if (!icons || icons.length === 0) {
      return NextResponse.json({ message: "No icons to process", processed: 0 })
    }

    let processed = 0
    let skipped = 0
    let failed = 0

    for (const icon of icons) {
      try {
        if (!icon.png_key) {
          skipped++
          continue
        }

        // Get existing image from R2/public URL
        let imageBuffer: Buffer

        if (icon.png_url) {
          const response = await fetch(icon.png_url)
          if (!response.ok) {
            console.error(`Failed to fetch image for ${icon.id}`)
            failed++
            continue
          }
          imageBuffer = Buffer.from(await response.arrayBuffer())
        } else {
          skipped++
          continue
        }

        // Make transparent
        const transparentBuffer = await makeTransparent(imageBuffer)

        // Re-upload to R2
        const newKey = icon.png_key.replace('.png', '-transparent.png')
        const newUrl = await uploadFile(newKey, transparentBuffer, "image/png")

        if (!newUrl) {
          console.error(`Failed to upload for ${icon.id}`)
          failed++
          continue
        }

        // Update database
        const { error: updateError } = await supabaseAdmin
          .from("generated_icons")
          .update({ 
            png_url: newUrl,
            png_key: newKey 
          })
          .eq("id", icon.id)

        if (updateError) {
          console.error(`Failed to update ${icon.id}:`, updateError)
          failed++
        } else {
          console.log(`Processed ${icon.id}`)
          processed++
        }

      } catch (err) {
        console.error(`Error processing ${icon.id}:`, err)
        failed++
      }
    }

    console.log(`Done! Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`)

    return NextResponse.json({
      success: true,
      processed,
      skipped,
      failed,
      total: icons.length
    })

  } catch (error) {
    console.error("Reprocess error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
