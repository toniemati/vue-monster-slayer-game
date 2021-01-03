const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            battleLogs: []
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0)
                return { width: '0%' };

            return { width: this.monsterHealth + '%' };
        },
        playerBarStyles() {
            if (this.playerHealth < 0)
                return { width: '0%' };

            return { width: this.playerHealth + '%' };
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        }
    },
    methods: {
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.battleLogs = [];
        },
        getRandomValue(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        attackMonster() {
            this.currentRound++;

            const attackValue = this.getRandomValue(5, 10);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);

            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = this.getRandomValue(8, 15);
            this.playerHealth -= attackValue;

            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;

            const attackValue = this.getRandomValue(10, 25);
            this.monsterHealth -= attackValue;

            this.addLogMessage('player', 'special-attack', attackValue);

            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = this.getRandomValue(8, 20);

            if (this.playerHealth + healValue > 100)
                this.playerHealth = 100;
            else
                this.playerHealth += healValue;

            this.addLogMessage('player', 'heal', healValue);

            this.attackPlayer();
        },
        surrender() {
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            this.battleLogs.unshift({
                who,
                what,
                value,
            });
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                //* draw
                this.winner = 'draw';
            } else if (value <= 0) {
                //* player lost
                this.winner = 'monster';
            }

        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                //* draw
                this.winner = 'draw';
            } else if (value <= 0) {
                //* monster lost
                this.winner = 'player';
            }

        }
    }
});

app.mount('#game');