export const templatePdf = () => {
    const template = `
        <DOCTYPE html>
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 12px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                    }
                    td {
                        padding: 5px;
                    }
                    .center {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h1 class="center">PDF Template</h1>
                <table>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>30</td>
                    </tr>
                    <tr>
                        <td>Jane</td>
                        <td>Doe</td>
                        <td>25</td>
                    </tr>
                </table>
            </body>
        </html>

    `;

    return template;
};


