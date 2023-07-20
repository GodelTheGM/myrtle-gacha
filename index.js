// web vars
var cb = {};
var t1 = 50;
var t2 = 200;
var t3 = 500;
var tps = 25;

var t0mark = '♣ ';
var t1mark = '♠ ';
var t2mark = '♦ ';
var t3mark = '♥ ';

// vars
var totalTipped = 0;
var bank = 0;
var tierLevel = 0; // 0 = common; 1 = uncommon; 2 = rare; 3 = legendary
var t1Key = 'Unlock Naughty Stuff! (Uncommon Tier Key)';
var t2Key = 'Unlock Sexy Stuff! (Rare Tier Key)';
var t3Key = 'Unlock Dirty Stuff! (Legendary Tier Key)';
var t1KeyLocked = true;
var t2KeyLocked = true;
var t3KeyLocked = true;
var rewards = {
	'common': ["Ivan Tastic","Luis Kent","Kevin Credible","Malcolm Witme","Will Power","Saul Lay","Miles Away","Maxwell Done","Judas Kiss","Max Speeds"],
	'uncommon': ["Genna Russ","Aster Starr","Perry Fomance","Betty Brilliance","Morgan Fatana","Sara Castique","Pho Lume","Eva Nessent","May Stirius","Sam Ooth"],
	'rare': ["Xahrel","Wahrtihr","Arlenrel","Mahrnear","Charelon","Iarovan","Caranear","Urrahn","Voxvyn","Vohrolan"],
	'legendary': ["Phisynore","Yrelraya","Hyrysh","Wylinoria","Qinona","Uhreva","Harelaya","Harelyss","Aeztia","Eshiriesh"]
} // dummy names for the test interface
var lastReward = "Nothing. Yet... ;)";

// control form
cb.settings_choices = [
	{name: 'tokens_per_spin', label: "Tokens Per Spin:", type: 'int', minValue: 1, default: 10},
	{name: 'goal_description', label: "Goal Description:", type: 'str', minLength: 1, maxLength: 255},
	{name: 'uncommon_key_at', label: "Uncommon Key Unlocks At:", type: 'int', minValue: 0, default: 0},
	{name: 'rare_key_at', label: "Rare Key Unlocks At:", type: 'int', minValue: 0, default: 0},
	{name: 'legendary_key_at', label: "Legendary Key Unlocks At:", type: 'int', minValue: 0, default: 0}
];

// handlers
function addTip(x) {
	totalTipped += x;
	bank += x;

	// check for and unlock key(s)
	if (t1KeyLocked && totalTipped >= t1) {
		t1KeyLocked = false;
		rewards.common = [t1Key].concat(rewards.common);
	}
	if (t2KeyLocked && totalTipped >= t2) {
		t2KeyLocked = false;
		rewards.uncommon = [t2Key].concat(rewards.uncommon);
	}
	if (t3KeyLocked && totalTipped >= t3) {
		t3KeyLocked = false;
		rewards.rare = [t3Key].concat(rewards.rare);
	}

	updateUI();
}

function spin() {
	if (bank >= tps) {
		bank -= tps;
		// build prize pool
		let prize = "...nothing...";
		let prizePool = rewards.common;
		if (tierLevel >= 1) {
			prizePool = prizePool.concat(rewards.uncommon);
		}
		if (tierLevel >= 2) {
			prizePool = prizePool.concat(rewards.rare);
		}
		if (tierLevel >= 3) {
			prizePool = prizePool.concat(rewards.legendary);
		}

		// select random from prize pool
		prize = prizePool[Math.floor(Math.random() * prizePool.length)];

		// check if prize is a key
		if (prize == t1Key) {
			tierLevel = 1;
		}
		if (prize == t2Key) {
			tierLevel = 2;
		}
		if (prize == t3Key) {
			tierLevel = 3;
		}

		// remove prize from list
		let searchIndex = rewards.common.indexOf(prize);
		if (searchIndex >= 0) {
			rewards.common.splice(searchIndex, 1);
			console.log("Removed from Common:");
			prize = t0mark + prize;
		}
		searchIndex = rewards.uncommon.indexOf(prize);
		if (searchIndex >= 0) {
			rewards.uncommon.splice(searchIndex, 1);
			console.log("Removed from Uncommmon:");
			prize = t1mark + prize;
		}
		searchIndex = rewards.rare.indexOf(prize);
		if (searchIndex >= 0) {
			rewards.rare.splice(searchIndex, 1);
			console.log("Removed from Rare:");
			prize = t2mark + prize;
		}
		searchIndex = rewards.legendary.indexOf(prize);
		if (searchIndex >= 0) {
			rewards.legendary.splice(searchIndex, 1);
			console.log("Removed from Legendary:");
			prize = t3mark + prize;
		}

		// assign to last reward
		lastReward = prize;
		console.log(prize);
	}
	updateUI();
}

// helper functions

// web app functions
function setE(id, content) {
	document.getElementById(id).innerHTML = content;
}

function listToUl(list) {
	let result = "";
	for (var i = 0; i < list.length; i++) {
		result += "<li>" + list[i] + "</li>";
	}
	return result;
}

function updateUI() {
	/* update total, bank, and spin count*/
	setE('tip-total', totalTipped);
	setE('bank', bank);
	setE('spin-count', Math.floor(bank/tps));

	/* update last reward*/
	setE('reward', lastReward);
	/* update headings and lists*/
	let lock = " (LOCKED)";

	/* commons */
	let label = t0mark + "Common";
	if (tierLevel < 0) {
		label += lock;
	}
	setE('common-label', label);
	setE('common-list', listToUl(rewards.common));

	/* uncommons */
	label = t1mark + "Uncommon";
	if (tierLevel < 1) {
		label += lock;
	}
	setE('uncommon-label', label);
	setE('uncommon-list', listToUl(rewards.uncommon));

	/* rares */
	label = t2mark + "Rare";
	if (tierLevel < 2) {
		label += lock;
	}
	setE('rare-label', label);
	setE('rare-list', listToUl(rewards.rare));

	/* legendaries */
	label = t3mark + "Legendary";
	if (tierLevel < 3) {
		label += lock;
	}
	setE('legendary-label', label);
	setE('legendary-list', listToUl(rewards.legendary));
}

// initialization
document.addEventListener("DOMContentLoaded", () => {
	console.log("Loaded!");
	setE('t1-unlock', t1);
	setE('t2-unlock', t2);
	setE('t3-unlock', t3);
	updateUI();
});