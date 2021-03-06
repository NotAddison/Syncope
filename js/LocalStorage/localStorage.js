const levelJSON = "static/levels.json";
const bossJSON = "static/bosses.json";

function localStorageSpace() {
    var allStrings = '';
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) + ' KB' : 'Empty (0 KB)';
}

function retrieveLocalStorage() {
    const retrievedDifficulty = window.localStorage.getItem('difficulty'),
          retrievedLevelData = window.localStorage.getItem('levelData'),
          retrievedPlayerData = window.localStorage.getItem('playerData');

    return { retrievedDifficulty, retrievedLevelData, retrievedPlayerData };
}

function DefineWordTime(retrievedDifficulty, difficultyTimings) {
    return (retrievedDifficulty === "0") ? difficultyTimings[0] // 40WPM
        : (retrievedDifficulty === "1") ? difficultyTimings[1] // 60WPM
            : (retrievedDifficulty === "2") ? difficultyTimings[2] // 90WPM
                : difficultyTimings[3]; // 100WPM
}

function parsePlayerData(playerData) {
    if (playerData[0] === "1") return new Player(100, 5);
}

async function getLevelJSON(retrievedLevelData = null) {
    let levelRes = await fetch(levelJSON)
    let levelData = await levelRes.json();

    if (retrievedLevelData === null) return parseInt(Object.keys(levelData).length + 1);
    let levelNo = `Level-${retrievedLevelData}`;
    const { DifficultyTimings, Entities } = levelData.Level[levelNo];
    return { DifficultyTimings, Entities };
}

async function getBossJSON(Entities) {
    let entityList = [];

    for (entityName of Entities) {
        let entityRes = await fetch(bossJSON)
        let entityData = await entityRes.json();

        const { Health, FailureDamage, ConstantDamage, APICalls } = entityData[entityName]
        let newEntity = new Enemy(entityName, Health, FailureDamage, ConstantDamage, APICalls);
        entityList.push(newEntity);
    }

    return entityList;
}

function TimeElapsedStorage(timeElapsed = 0) {
    let initial = parseInt(window.localStorage.getItem('timeElapsed'));
    window.localStorage.setItem("timeElapsed", initial + timeElapsed);
}