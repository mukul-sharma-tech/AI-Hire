import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const { jobDescription, resume } = await request.json();

        if (!jobDescription || !resume) {
            return NextResponse.json({ error: 'Job description and resume are required.' }, { status: 400 });
        }
        
        // Path to the python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'analyzer.py');
        
        // Use a promise to handle the async nature of the child process
        const analysisResult = await new Promise((resolve, reject) => {
            // Spawn a Python process. Changed 'python3' to 'python' for better Windows compatibility.
            const pythonProcess = spawn('python', [scriptPath]);
            
            let output = '';
            let errorOutput = '';

            // Pass data to the python script's stdin
            pythonProcess.stdin.write(JSON.stringify({ jobDescription, resume }));
            pythonProcess.stdin.end();

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python script exited with code ${code}`);
                    console.error('Stderr:', errorOutput);
                    reject(new Error(errorOutput || 'An error occurred in the Python script.'));
                } else {
                    resolve(output);
                }
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start subprocess.', err);
                reject(new Error('Failed to start the analysis process.'));
            });
        });

        return NextResponse.json({ analysis: analysisResult });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

