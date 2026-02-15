import { isValidInn, detectPaymentSystem } from './validators.js';
import imgVisa from '../img/visa.png';
import imgMaster from '../img/master.png';
import imgMir from '../img/mir.png';
import imgAmex from '../img/amex.png';
import imgDisc from '../img/discover.png';
import imgJcb from '../img/jcb.png';

const Visa = imgVisa;
const Mast = imgMaster;
const Mir = imgMir;
const Amex = imgAmex;
const Disc = imgDisc;
const Jcb = imgJcb;

export class CardValidatorWidget {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cardImages = {
            VISA: Visa,
            MASTERCARD: Mast,
            MIR: Mir,
            AMEX: Amex,
            DISCOVER: Disc,
            JCB: Jcb
        };

        this.systemMapping = {
            'visa': 'VISA',
            'mastercard': 'MASTERCARD',
            'mir': 'MIR',
            'amex': 'AMEX',
            'discover': 'DISCOVER',
            'jcb': 'JCB'
        };

        this.init();
    }

    init() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="card-validator">
                <h3>Проверка кредитной карты</h3>
                <div class="card-icons">
                    ${Object.keys(this.cardImages).map(system =>
            `<div class="card-icon-wrapper" data-system="${system}">
                            <img src="${this.cardImages[system]}" 
                                 alt="${system}" 
                                 class="card-icon" 
                                 data-system="${system}"
                                 onerror="this.onerror=null; 
                                 this.style.display='none'; 
                                 this.parentElement.classList.add('icon-placeholder'); 
                                 this.parentElement.setAttribute('data-initials', 
                                 '${system.substring(0, 2)}');">
                            <span class="icon-fallback" style="display:none;">${system.substring(0, 2)}</span>
                        </div>`
        ).join('')}
                </div>
                <div class="input-group">
                    <input type="text" id="card-number" class="card-input" placeholder="Введите номер карты" maxlength="19" autocomplete="off">
                    <button id="validate-card" class="validate-btn">Click to Validate</button>
                </div>
                <div class="validation-result"></div>
            </div>
        `;

        this.input = this.container.querySelector('#card-number');
        this.button = this.container.querySelector('#validate-card');
        this.result = this.container.querySelector('.validation-result');
        this.cardIcons = this.container.querySelectorAll('.card-icon');
        this.demoButtons = this.container.querySelectorAll('.demo-btn');

        this.attachEvents();
    }

    attachEvents() {
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.button.addEventListener('click', this.handleValidate.bind(this));
        this.demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const formatted = cardNumber.match(/.{1,4}/g).join(' ');
                this.input.value = formatted;
                this.handleInput({ target: this.input });
                this.handleValidate();
            });
        });
    }

    handleInput(e) {
        let value = e.target.value.replace(/\s/g, '');

        if (value.length > 0) {
            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        }

        const cleanValue = e.target.value.replace(/\s/g, '');
        const system = detectPaymentSystem(cleanValue);
        const mappedSystem = system ? this.systemMapping[system.toLowerCase()] : null;

        this.container.querySelectorAll('.card-icon').forEach(icon => {
            icon.classList.remove('active');
        });

        if (mappedSystem) {
            const activeIcon = this.container.querySelector
                (`.card-icon[data-system="${mappedSystem}"]`);
            if (activeIcon) {
                activeIcon.classList.add('active');
            }
        }
    }

    handleValidate() {
        const cardNumber = this.input.value;
        const validation = isValidInn(cardNumber);

        let message = '';
        let className = '';

        if (!cardNumber) {
            message = 'Введите номер карты';
            className = 'error';
        } else if (!validation.isPotentiallyValid) {
            message = 'Неверный формат номера карты';
            className = 'error';
        } else if (!validation.isValid) {
            message = 'Неверный номер карты (ошибка контрольной суммы)';
            className = 'error';
        } else if (!validation.system) {
            message = 'Номер валиден, но платежная система не определена';
            className = 'warning';
        } else {
            message = `✅ Валидная карта ${validation.system}`;
            className = 'success';
        }

        this.result.className = `validation-result ${className}`;
        this.result.textContent = message;
    }
}