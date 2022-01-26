export const accountVerificationTemplate = (url: string) => {
    const message = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                    font-family: "Lucida Sans", "Lucida Sans Regular",
                        "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana,
                        sans-serif;
                }
            </style>
            <title>Document</title>
        </head>
        <body
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 1px solid black;
                border-radius: 1.15em;
                max-width: 20em;
                margin: 2em auto;
            "
        >
            <header
                style="
                    border: 2px solid rgba(128, 128, 128, 0.288);
                    padding: 2em;
                    border-radius: 1em;
                    color: rgba(128, 128, 128, 0.616);
                    display: flex;
                    align-items: center;
                "
            >
                <h1 style="text-align: center">Account Verification</h1>
            </header>
    
            <main style="margin-top: 1.5em">
                <div>
                    To complete the registration please click in the next link:
                </div>
                <br />
                <div style="margin-top: 0.5em; color: rgb(187, 0, 0)">
                    <a href="${url}">Click Here</a>
                </div>
            </main>
    
            <footer style="min-width: 15vw; margin-top: 5em">
                <p>Best regards!</p>
                <p>Planet Books Team</p>
            </footer>
        </body>
    </html>
    
`;

    return message;
};
