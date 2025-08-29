// Decimals tests
import { tests as decTestsHex } from "./decimals/decimals_to_hexadecimal.test.js";
import { tests as decTestsOct } from "./decimals/decimals_to_octal.test.js";
import { tests as decTestsBin } from "./decimals/decimals_to_binary.test.js";

// Binary Tests
import { tests as binTestsOct } from "./binary/binary_to_octal.test.js";
import { tests as binTestsDec } from "./binary/binary_to_decimal.test.js";
import { tests as binTestsHex } from "./binary/binary_to_hexadecimal.test.js";

class Tester {
    static #url = 'http://localhost:3300/api/converter';
    static #body = {
        "from": {},
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
            this.#body.from.type = 'decimal';
            console.log('                        DECIMALS TESTS');
            await this.#executeTests(decTestsBin, 'binary', 'To Binary');
            await this.#executeTests(decTestsOct, 'octal', 'To Octal');
            await this.#executeTests(decTestsHex, 'hexadecimal', 'To Hexadecimal');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllBinaryTests() {
        try {
            this.#body.from.type = 'binary';
            console.log('                        BINARY TESTS');
            await this.#executeTests(binTestsOct, 'octal', 'To Octal');
            await this.#executeTests(binTestsDec, 'decimal', 'To Decimal');
            await this.#executeTests(binTestsHex, 'hexadecimal', 'To Hexadecimal');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllTests() {
        await this.runAllDecimalsTests();
        console.log('\n');
        await this.runAllBinaryTests();
    }
}

console.clear();
Tester.runAllTests();