import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const { company, position, level, interviewType, interviewDate } = await request.json();

        if (!company || !position || !level || !interviewType || !interviewDate) {
            return NextResponse.json({ error: 'Missing required fields for interview prep.' }, { status: 400 });
        }
        
        const scriptPath = path.join(process.cwd(), 'scripts', 'interviewPrep.py');
        
        const generationResult = await new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [scriptPath]);
            
            let output = '';
            let errorOutput = '';

            const inputData = { company, position, level, interviewType, interviewDate };
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

        return NextResponse.json({ roadmap: generationResult });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}

