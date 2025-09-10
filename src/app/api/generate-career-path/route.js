import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const { stage, institution, field, background } = await request.json();

        if (!stage || !institution || !field || !background) {
            return NextResponse.json({ error: 'Missing required fields. Please fill out the entire form.' }, { status: 400 });
        }
        
        // Path to the python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'career_generator.py');
        
        // Use a promise to handle the async nature of the child process
        const generationResult = await new Promise((resolve, reject) => {
            // Spawn a Python process. Use 'python' for cross-platform compatibility.
            const pythonProcess = spawn('python', [scriptPath]);
            
            let output = '';
            let errorOutput = '';

            // Pass data to the python script's stdin
            const inputData = { stage, institution, field, background };
            pythonProcess.stdin.write(JSON.stringify(inputData));
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
                    reject(new Error(errorOutput || 'An error occurred in the Python generation script.'));
                } else {
                    resolve(output);
                }
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start subprocess.', err);
                reject(new Error('Failed to start the generation process.'));
            });
        });

        return NextResponse.json({ careerPath: generationResult });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

