import { tests as testsBin } from "./decimals_to_binary.test.js";
import { tests as testsOct } from "./decimals_to_octal.test.js";

class Tester {
    static #url = 'http://localhost:3300/api/converter';
    static #body = {
        "from": {
            "type": "decimal"
        },
        "to": {}
    };

    static executeTest(test) {
        // Set the current value in the body
        const { input, expected } = test;
        this.#body.from.value = input;

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
                console.log(message);
            }).catch(err => {
                console.log(err.message)
            });
    }

    static runBinaryTests() {
        // Set the 'to.type' in the body
        this.#body.to.type = 'binary';

        // Execute all the binary tests
        testsBin.forEach(test => {
            this.executeTest(test);
        });
    }

    static runOctalTests() {
        // Set the 'to.type' in the body
        this.#body.to.type = 'octal';

        // Execute all the octal tests
        testsOct.forEach(test => {
            this.executeTest(test);
        });
    }
}

Tester.runOctalTests();
