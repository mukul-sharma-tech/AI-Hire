import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const { theme, problemStatement } = await request.json();

        if (!theme || !problemStatement) {
            return NextResponse.json({ error: 'Theme and problem statement are required.' }, { status: 400 });
        }
        
        const scriptPath = path.join(process.cwd(), 'scripts', 'hackathonMent.py');
        
        const generationResult = await new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [scriptPath]);
            
            let output = '';
            let errorOutput = '';

            const inputData = { theme, problemStatement };
            pythonProcess.stdin.write(JSON.stringify(inputData));
            pythonProcess.stdin.end();

            pythonProcess.stdout.on('data', (data) => { output += data.toString(); });
            pythonProcess.stderr.on('data', (data) => { errorOutput += data.toString(); });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python script exited with code ${code}: ${errorOutput}`);
                    reject(new Error(errorOutput || 'An error occurred in the Python script.'));
                } else {
                    resolve(output);
                }
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start subprocess.', err);
                reject(new Error('Failed to start the generation process.'));
            });
        });

        return NextResponse.json({ plan: generationResult });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

