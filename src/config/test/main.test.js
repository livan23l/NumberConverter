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
    
                    // Show the corresponding message
                    const message = (res == expected)
                        ? 'Test: [OK]'
                        : `Test: [Error] - Expected '${expected}' and received ` +
                        `'${res}' in the input '${input}'.`;
                    resolve(message);
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
        for (const test of tests) {
            try {
                const message = await this.#executeTest(test);
                console.log(message);
            } catch(err) {
                console.log(err.message);
            }
        }
    }

    static async runAllTests() {
        try {
            await this.#executeTests(testsBin, 'binary', 'Binary Tests');
            console.log('\n\n\n');
            await this.#executeTests(testsOct, 'octal', 'Octal Tests');
            console.log('\n\n\n');
            await this.#executeTests(testsHex, 'hexadecimal', 'Hexadecimal Tests');
        } catch(err) {
            console.log(err.message);
        }
    }
}

Tester.runAllTests();
