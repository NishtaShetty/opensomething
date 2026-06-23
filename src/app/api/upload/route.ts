import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY || "8fd9664a1522bb0dd810",
            "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY || "921a945f7cadcb249aadc276f3fa3d5d0edc87ddd09f0a39565135c52550372d"
        },
        body: pinataFormData
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
