import { tests as testsHex } from "./decimals/decimals_to_hexadecimal.test.js";
import { tests as testsOct } from "./decimals/decimals_to_octal.test.js";
import { tests as testsBin } from "./decimals/decimals_to_binary.test.js";

class Tester {
    static #url = 'http://localhost:3300/api/converter';
    static #body = {
        "from": {
            "type": "decimal"
        },
        "to": {}
    };

    static #executeTest(test) {
        // Set the current value in the body
        const { input, expected } = test;
        this.#body.from.value = input;

        return new Promise((resolve, reject) => {
            fetch(this.#url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.#body)
            })
                .then(response => response.json())
                .then(data => {
                    // Get the current res
                    const res = data.data;
    
                    // Show the corresponding response
                    const response = (res == expected)
                        ? { status: 'OK' }
                        : {
                            status: 'Error',
                            error: `Expected '${expected}' and received ` +
                                   `'${res}' in the input '${input}'.`
                        };
                    resolve(response);
                }).catch(err => {
                    reject(new Error(err.message));
                });
        });
    }

    static async #executeTests(tests, type, title = 'Untitled Tests') {
        // Set the 'to.type' in the body
        this.#body.to.type = type;

        // Show the current title
        console.log(`------------------------${title}------------------------`);

        // Run the tests
        let okTests = 0;
        for (const test of tests) {
            try {
                const response = await this.#executeTest(test);
                if (response.status == 'OK') okTests++;
                else console.log(`Test [Error]: ${response.error}`);
            } catch(err) {
                console.log(err.message);
            }
        }
        if (okTests > 0) console.log(`Test [OK]: ${okTests} tests passed`);
    }

    static async runAllDecimalsTests() {
        try {
            console.log('                        DECIMALS TESTS');
            await this.#executeTests(testsBin, 'binary', 'To Binary');
            await this.#executeTests(testsOct, 'octal', 'To Octal');
            await this.#executeTests(testsHex, 'hexadecimal', 'To Hexadecimal');
        } catch(err) {
            console.log(err.message);
        }
    }
}

console.clear();
// Tester.runAllDecimalsTests();
// Tester.runAllBinaryTests();