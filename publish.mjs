import inquirer from 'inquirer';
import { exec } from 'child_process';
import { chdir } from 'process';


const excecuteTerminalCommand = ({ command, progressMessage, successMessage }) => {

    return new Promise((resolve) => {
        const spinnerFrames = ['|', '/', '-', '\\'];
        let i = 0;
        console.log('\n');
        const spinner = setInterval(() => {
            process.stdout.write('\r' + spinnerFrames[i++ % spinnerFrames.length] + ` ${progressMessage}`);
        }, 100);
        exec(command, (error, stdout, stderr) => {
            clearInterval(spinner);
            if (error) { console.error(`Error: ${error.message}`); return; }
            if (stderr) { console.error(`stderr: ${stderr}`); return; }
            console.log('\n');
            console.log(`${successMessage}`);
            resolve();
        });
    })

}

async function getUserInput() {
    const inputOptions = ['All Models', 'UI Models', 'BFF Models'];

    const answers = await inquirer.prompt(
        {
            type: 'list', // This type simulates radio buttons
            name: 'model',
            message: 'Please select the model you need to publish:',
            choices: inputOptions
        }
    )

    switch (answers.model) {
        case inputOptions[1]: // UI Models
            chdir('./@ui-models');
            excecuteTerminalCommand({
                command: 'npm run build',
                progressMessage: 'Starting build for UI Models...',
                successMessage: 'UI Models build completed successfully.'
            });
            break;
        case inputOptions[2]: // BFF Models
            chdir('./@bff-models');
            excecuteTerminalCommand({
                command: 'npm run build',
                progressMessage: 'Starting build for BFF Models...',
                successMessage: 'BFF Models build completed successfully.'
            });
            break;
        default:
            chdir('./@bff-models'); // All Models
            excecuteTerminalCommand({
                command: 'npm run build',
                progressMessage: 'Starting build for BFF Models...',
                successMessage: 'BFF Models build completed successfully.'
            }).finally(() => {
                chdir('./..');
                chdir('./@ui-models');
                excecuteTerminalCommand({
                    command: 'npm run build',
                    progressMessage: 'Starting build for UI Models...',
                    successMessage: 'UI Models build completed successfully.'
                });
            })
            break;
    }

}



getUserInput();