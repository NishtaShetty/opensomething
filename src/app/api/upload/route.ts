import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY as string,
            "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY as string
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const uploadData = await response.json();
    
    return NextResponse.json({
      ipfsHash: uploadData.IpfsHash,
      pinSize: uploadData.PinSize,
      timestamp: uploadData.Timestamp,
    }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
