class Converter {
    #from;
    #to;

    #invertElements() {
        const temporalOption = this.#from.$select.value;
        const temporalText = this.#from.$textarea.value;

        // Invert the values
        //--From
        this.#from.$select.value = this.#to.$select.value;
        this.#from.lastSelectValue = this.#from.$select.value;
        this.#from.$textarea.value = this.#to.$textarea.value;
        //--To
        this.#to.$select.value = temporalOption;
        this.#to.lastSelectValue = this.#to.$select.value;
        this.#to.$textarea.value = temporalText;
    }

    #changeSelectEvent() {
        const handleChange = (changed, adverse) => {
            if (changed.$select.value == adverse.$select.value) {
                changed.$select.value = changed.lastSelectValue;
                return this.#invertElements();
            }

            changed.lastSelectValue = changed.$select.value;
        }

        this.#from.$select.addEventListener('change', () => {
            handleChange(this.#from, this.#to);
        });
        this.#to.$select.addEventListener('change', () => {
            handleChange(this.#to, this.#from);
        });
    }

    #changeBtnClickEvent() {
        const $changeBtn = document.querySelector('#button-change');

        $changeBtn.addEventListener('click', () => {
            this.#invertElements();
        });
    }

    constructor() {
        // Set attributes
        this.#from = {
            $select: document.querySelector('#select-from'),
            $textarea: document.querySelector('#textarea-from'),
        };
        this.#to = {
            $select: document.querySelector('#select-to'),
            $textarea: document.querySelector('#textarea-to'),
        };
        this.#from.lastSelectValue = this.#from.$select.value;
        this.#to.lastSelectValue = this.#to.$select.value;
        this.validValues = ['decimal', 'binary', 'hexadecimal', 'octal', 'text'];

        // Set the events
        this.#changeBtnClickEvent();
        this.#changeSelectEvent();
    }
}

new Converter();