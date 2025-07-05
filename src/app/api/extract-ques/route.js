import pdfParse from 'pdf-parse';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('pdf');

  if (!file) {
    return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const data = await pdfParse(buffer);
    const rawText = data.text;

    // Extract all non-empty lines
    const questions = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to parse PDF.' }, { status: 500 });
  }
}
